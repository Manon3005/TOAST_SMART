const { ParserService } = require("../backend/services/ParserService.js");
const {
  ComputeStatistics,
} = require("../backend/services/ComputeStatistics.js");
const { JsonExporter } = require("../backend/utils/JsonExporter.js");
const { CsvExporter } = require("../backend/utils/CsvExporter.js");
const { ConflictHandler } = require("../backend/services/ConflictHandler.js");

const path = require("path");
const { app, BrowserWindow, screen: electronScreen } = require("electron/main");
const { Parser } = require("csv-parse");
const fs = require("fs");
const os = require("os");
const { ipcMain, dialog } = require("electron");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);

const { shell } = require("electron");

// Create the express server in order to use the static files in the frontend public folder
const express = require("express");
const { json } = require("stream/consumers");
const { NeighboursLinker } = require("../backend/utils/NeighboursLinker.js");
const appServer = express();
appServer.use(express.static(path.join(__dirname, "frontend", "public")));

enum Diet {
  NoSpecificDiet = "pas de régime spécifique-",
  NoPork = "sans porc-",
  Vegetarian = "végétarien-",
  GlutenFree = "sans gluten-",
  Vegan = "vegan-",
  Unrecognized = "non reconnu-",
}
interface Guest {
  id: number;
  ticket: string;
  lastName: string;
  firstName: string;
  diet: Diet;
}
interface Table {
  id: string;
  nbMaxStudent: number;
  studentList: GraduatedStudent[];
  nbStudent: number;
  nbFilledSeat: number;
}
interface GraduatedStudent {
  id: number;
  ticket: string;
  lastName: string;
  firstName: string;
  email: string;
  nbGuests: number;
  nbNeighbours: number;
  guests: Guest[];
  neighbours: GraduatedStudent[];
  potentialNeighbours: GraduatedStudent[];
  neighboursString: string;
  diet: Diet;
  doubleEmailCatched: boolean;
  table: Table;
}

let globalFilePath = "";
let allGraduatedStudents: GraduatedStudent[];
let maxTables: number;
let allTables: Table[];

async function createWindow() {
  const { width, height } = electronScreen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.floor(width),
    height: Math.floor(height),
    minWidth: Math.floor(width),
    minHeight: Math.floor(height),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/preload.js"),
    },
  });

  win.setMenu(null);
  win.maximize();
  win.setResizable(true);
  win.loadFile(path.join(__dirname, "../../frontend", "build", "index.html"));
  win.webContents.openDevTools(); // pour debogage
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("dialog:openFile", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"], //openFile fconction Electron pour ouvrir un fichier
    filters: [
      { name: "CSV", extensions: ["csv"] }, // filtre pour les CSV
    ],
  });

  if (result.canceled) {
    return null;
  } else {
    const filePath = result.filePaths[0];
    globalFilePath = filePath;
    return await ParserService.getColumnNamesFromCsvFile(filePath);
  }
});

ipcMain.handle(
  "dialog:beginCsvParsing",
  async (event: Event, jsonColumnNames: any) => {
    // Set the column names
    ParserService.setInputColumnsNames(jsonColumnNames);
    // Call the csv treatment
    try {
      ParserService.reinitialize();
      allGraduatedStudents = await ParserService.readRawFileCSV(globalFilePath);
    } catch (error: any) {
      return { error: jsonColumnNames.ticket };
    }
    // Return the first conflict
    return {};
  }
);

ipcMain.handle(
  "dialog:resolveConflict",
  async (
    event: Event,
    jsonSolution: {
      id_student: number;
      id_neighbour: number;
      result: "accepted" | "refused";
    }
  ) => {
    const id_student = jsonSolution.id_student;
    const id_neighbour = jsonSolution.id_neighbour;
    const result = jsonSolution.result;
    await ConflictHandler.resolveConflict(
      id_student,
      id_neighbour,
      result,
      allGraduatedStudents
    );
    const student = allGraduatedStudents.find(
      (student) => student.id == id_student
    );
    return await ConflictHandler.getStudentWithConflicts(student);
  }
);

ipcMain.handle("dialog:deleteAllConflicts", async () => {
  await ConflictHandler.deleteAllConflicts(allGraduatedStudents);
  //gérer erreur
});

ipcMain.handle(
  "dialog:addNeighbour",
  async (
    event: Event,
    jsonInfo: {
      id_student: number;
      id_neighbour: number;
    }
  ) => {
    const id_student = jsonInfo.id_student;
    const id_neighbour = jsonInfo.id_neighbour;
    await NeighboursLinker.addNeighbour(
      allGraduatedStudents,
      id_student,
      id_neighbour
    );
    const student = allGraduatedStudents.find(
      (student) => student.id == id_student
    );
    return ConflictHandler.getStudentWithConflicts(student);
    //gérer erreur
  }
);

ipcMain.handle(
  "dialog:removeNeighbour",
  async (
    event: Event,
    jsonInfo: {
      id_student: number;
      id_neighbour: number;
    }
  ) => {
    const id_student = jsonInfo.id_student;
    const id_neighbour = jsonInfo.id_neighbour;
    await NeighboursLinker.removeNeighbour(
      allGraduatedStudents,
      id_student,
      id_neighbour
    );
    const student = allGraduatedStudents.find(
      (student) => student.id == id_student
    );
    return ConflictHandler.getStudentWithConflicts(student);
    //gérer erreur
  }
);

ipcMain.handle("dialog:generateIntermediateCsv", async () => {
  const directoryPath = path.dirname(globalFilePath);
  const ext = path.extname(globalFilePath);
  const baseName = path.basename(globalFilePath, ext);
  const filePath = path.join(
    directoryPath,
    baseName + "_cleaned_input_file.csv"
  );
  CsvExporter.exportCleanedInputCsv(
    ParserService.columns,
    allGraduatedStudents,
    filePath
  );
  return filePath;
});

ipcMain.handle(
  "dialog:generateTablePlan",
  async (
    event: Event,
    jsonData: {
      max_number_tables: number;
      max_number_by_tables: number;
      selected_choice: string;
    }
  ) => {
    // Get the json from the front
    maxTables = jsonData.max_number_tables;
    const maxByTables = jsonData.max_number_by_tables;
    const selectedChoice = jsonData.selected_choice;

    // Generate the output path
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const dateStr =
      year +
      "-" +
      month +
      "-" +
      day +
      "_" +
      hour +
      "H" +
      minute +
      "m" +
      second +
      "s";

    // Create the json information for the table plan
    const inputPath = path.join(
      path.dirname(globalFilePath),
      "jsonAlgorithmInput.json"
    );
    await JsonExporter.createJsonFileForAlgorithm(
      inputPath,
      maxTables,
      maxByTables,
      selectedChoice,
      allGraduatedStudents
    );
    // Launch the generation of the table plan
    const isWindows = os.platform() === "win32";
    const executableName = isWindows ? "main.exe" : "main";
    const executablePath = path.resolve(
      __dirname,
      "..",
      "..",
      "backend",
      "src",
      "algorithm",
      executableName
    );
    const fileName = "planTable_" + dateStr;
    const outputPath = path.join(
      path.dirname(globalFilePath),
      fileName + ".csv"
    );
    const rapportPath = path.join(
      path.dirname(globalFilePath),
      fileName + "_rapport_json.json"
    );
    const groupTablePath = path.join(
      path.dirname(globalFilePath),
      fileName + "_table_group.csv"
    );

    try {
      const { stdout, stderr } = await execFile(executablePath, [
        inputPath,
        outputPath,
      ]);
      fs.unlinkSync(inputPath);
    } catch (error) {
      throw error;
    }
    // Return the address of the generated csv
    ParserService.reinitializeTables();
    allTables = await ParserService.importTablesCSV(
      outputPath,
      allGraduatedStudents
    );
    const statsJson = await ComputeStatistics.getStatistics(
      allGraduatedStudents,
      ParserService.getTables(),
      maxTables
    );
    const rapportJson = await ParserService.parseRapportJson(rapportPath);
    return {
      addressPlanTable: outputPath,
      addressGroupTable: groupTablePath,
      statsJson,
      rapportJson,
    };
  }
);

ipcMain.handle("dialog:getStatistics", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"], //openFile fconction Electron pour ouvrir un fichier
    filters: [
      { name: "CSV", extensions: ["csv"] }, // filtre pour les CSV
    ],
  });

  if (result.canceled) {
    return null;
  } else {
    const filePath = result.filePaths[0];
    globalFilePath = filePath;
    ParserService.reinitializeTables();
    allTables = await ParserService.importTablesCSV(
      filePath,
      allGraduatedStudents
    );
    const statsJson = await ComputeStatistics.getStatistics(
      allGraduatedStudents,
      ParserService.getTables(),
      maxTables
    );
    return {
      address: filePath,
      statsJson,
    };
  }
});

ipcMain.handle("dialog:exportTablesCsv", async () => {
  const dir = path.dirname(globalFilePath);
  const baseName = path.basename(globalFilePath, path.extname(globalFilePath));
  const finalFileName = `${baseName}_final_repartition.csv`;
  const outputPath = path.join(dir, finalFileName);
  CsvExporter.exportPlacementCsv(allTables, outputPath);
  await shell.openPath(outputPath);
  return outputPath;
});

ipcMain.handle("dialog:getAllStudent", async () => {
  return await JsonExporter.getListStudents(allGraduatedStudents);
});

ipcMain.handle(
  "dialog:getStudentWithConflicts",
  async (event: Event, jsonSolution: { id_student: number }) => {
    const id_student = jsonSolution.id_student;
    const student = allGraduatedStudents.find(
      (student) => student.id == id_student
    );
    return await ConflictHandler.getStudentWithConflicts(student);
  }
);
