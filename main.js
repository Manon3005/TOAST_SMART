const { ParserService } = require("./backend/dist/backend/services/ParserService.js");
const { GraduatedStudent } = require("./backend/dist/backend/business/Objects.js")
const path = require('path')
const { app, BrowserWindow, screen } = require('electron/main');
const { Parser } = require("csv-parse");
const { ipcMain, dialog } = require('electron');

// Create the express server in order to use the static files in the frontend public folder
const express = require('express');
const { json } = require("stream/consumers");
const appServer = express();
appServer.use(express.static(path.join(__dirname, 'frontend', 'public')));


let globalFilePath = "";

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
  ParserService.setColumnsNames({
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
    await ParserService.readFileCSV(globalFilePath);
  } catch (error) {
    return {error : error.message};
  }
  // Return pairing results from parsing for validation
  return await ParserService.getNeighboursPairing();
}); 

ipcMain.handle('dialog:generateTablePlan', async (event, jsonData) => {
  // Get the json from the front
  const maxTables = jsonData.max_number_tables;
  const maxByTables = jsonData.max_number_by_tables;
  const invalidNeighboursStudentId = jsonData.invalid_neighbours_student_id;
  // Call the service in order to delete the non valid neighbours
  await ParserService.deleteNonValidNeighbours(invalidNeighboursStudentId);
  // Create the json information for the table plan
  await ParserService.createJsonFileForAlgorithm("backend/resources/jsonAlgorithmInput.json", maxTables, maxByTables);
  // Launch the generation of the table plan

  // Return the address of the generated csv
});