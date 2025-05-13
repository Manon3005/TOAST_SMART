const { ParserService } = require("./backend/dist/backend/services/ParserService.js");
const { GraduatedStudent } = require("./backend/dist/backend/business/GraduatedStudent.js");
const { JsonExporter } = require("./backend/dist/backend/utils/JsonExporter.js")
const { ConflictHandler } = require("./backend/dist/backend/utils/CsvExporter.js")
const path = require('path')
const { app, BrowserWindow, screen } = require('electron/main');
const { Parser } = require("csv-parse");
const { ipcMain, dialog } = require('electron');
const { execFile } = require('child_process');

// Create the express server in order to use the static files in the frontend public folder
const express = require('express');
const { json } = require("stream/consumers");
const appServer = express();
appServer.use(express.static(path.join(__dirname, 'frontend', 'public')));


let globalFilePath = "";
let allGraduatedStudents;

async function createWindow() {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  
  const win = new BrowserWindow({
    width: Math.floor(width),    
    height: Math.floor(height),    
    minWidth: Math.floor(width),                       
    minHeight: Math.floor(height),
    width: Math.floor(width),    
    height: Math.floor(height),    
    minWidth: Math.floor(width),                       
    minHeight: Math.floor(height),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    
  })

  win.setMenu(null);
  win.maximize();
  win.setResizable(true);
  win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  //win.webContents.openDevTools();  // pour debogage
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'], //openFile fconction Electron pour ouvrir un fichier
    filters: [
      { name: 'CSV', extensions: ['csv'] }, // filtre pour les CSV
    ],
  });

  if (result.canceled) {
    return null;
  } else {
    const filePath = result.filePaths[0];
    globalFilePath = filePath
    return await ParserService.getColumnNamesFromCsvFile(filePath);
  }
});

ipcMain.handle('dialog:beginCsvParsing', async (event, jsonColumnNames) => {
  // Set the column names
  ParserService.setInputColumnsNames({
    ticket: jsonColumnNames.ticket,
    firstName: jsonColumnNames.firstName,
    lastName: jsonColumnNames.lastName,
    buyerfirstName: jsonColumnNames.buyerFirstName,
    buyerlastName: jsonColumnNames.buyerLastName,
    buyerEmail: jsonColumnNames.buyerEmail,
    diet: jsonColumnNames.diet,
    wantedTableMates: jsonColumnNames.wantedTableMates,
  });
  // Call the csv treatment
  try {
    allGraduatedStudents = await ParserService.readRawFileCSV(globalFilePath);
  } catch (error) {
    return {error : error.message};
  }
  // Return the first conflict
  return await ConflictHandler.getNextConflict(allGraduatedStudents);
}); 

ipcMain.handle('dialog:getNextConflict', async (event, jsonSolution) => {
  const id_student = jsonSolution.id_student;
  const id_neighbour = jsonSolution.id_neighbour;
  const result = jsonSolution.result;
  await ConflictHandler.resolveConflict(id_student, id_neighbour, result, allGraduatedStudents);
  return await ConflictHandler.getNextConflict(allGraduatedStudents);
});

ipcMain.handle('dialog:generateTablePlan', async (event, jsonDataBrut) => {
  const jsonData = JSON.parse(jsonDataBrut);
  // Get the json from the front
  const maxTables = jsonData.max_number_tables;
  const maxByTables = jsonData.max_number_by_tables;
  // Create the json information for the table plan
  await JsonExporter.createJsonFileForAlgorithm("backend/resources/jsonAlgorithmInput.json", maxTables, maxByTables, allGraduatedStudents);
  // Launch the generation of the table plan
  const executablePath = path.resolve(__dirname, 'backend', 'algorithm', 'main.exe');
  const inputPath = path.resolve(__dirname, 'backend', 'resources', 'jsonAlgorithmInput.json');

  // Generate the output path
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const dateStr = year + "-" + month + "-" + day + "_" + hour + "H" + minute + "m" + second + "s";
  
  // "2023-09-11T02:41:56
  const outputPath = globalFilePath.slice(0, globalFilePath.length - 4) + "_planTable_" + dateStr + ".csv";

  execFile(executablePath, [inputPath, outputPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur : ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr : ${stderr}`);
      return;
    }
    console.log(`Sortie : ${stdout}`);
  });
  // Return the address of the generated csv
  return path.resolve(__dirname, 'backend', 'resources', 'seatingArrangements.csv');
});