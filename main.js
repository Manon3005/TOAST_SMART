const { ParserService } = require("./backend/dist/backend/services/ParserService.js");
const { GraduatedStudent } = require("./backend/dist/backend/business/Objects.js")
const path = require('path')
const { app, BrowserWindow, screen } = require('electron/main');
const { Parser } = require("csv-parse");
const { ipcMain, dialog } = require('electron');

async function createWindow() {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const win = new BrowserWindow({
    width: Math.floor(width * 0.6),    
    height: Math.floor(height * 0.8),    
    minWidth: 800,                       
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  /*The call here is a test and will be deleted at the end of the project*/
  await csvTreatment("resources/files/export_pr_plan_virgule.csv");

  win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  //win.webContents.openDevTools();  // pour debogage
}

async function csvTreatment(path) {
  try {
    ParserService.setColumnsNames({
      firstName: "Prénom",
      lastName: "Nom",
      buyerfirstName: "Prénom acheteur",
      buyerlastName: "Nom acheteur",
      buyerEmail: "E-mail acheteur",
      diet: "Régime alimentaire #131474",
      wantedTableMates: "Avec qui voulez-vous manger? (commande) #135122",
    }); 
    await ParserService.readFileCSV(path);
    const graduatedStudents = await ParserService.linkNeighboursToGraduatedStudents();
    if (Array.isArray(graduatedStudents)) {
      console.log(graduatedStudents);
      graduatedStudents.forEach((student) => {
        console.log(`Student ${student.id}:`);
        console.log(`  LastName: ${student.lastName}`);
        console.log(`  FirstName: ${student.firstName}`);
        console.log(`  Email: ${student.email}`);
        console.log(`  Diet: ${student.diet}`);
        console.log(`  Number of Guests: ${student.nbGuest}`)
        if (Array.isArray(student.guests)) {
          student.guests.forEach((guest) => {
            console.log(`    Guest ${guest.id}:`);
            console.log(`      LastName: ${guest.lastName}`);
            console.log(`      FirstName: ${guest.firstName}`);
            console.log(`      Diet: ${guest.diet}`);
          });
        }
        console.log(`  Number of Neighbours: ${student.nbNeighbour}`)
        console.log(`  Neighbours: ${student.neighboursString}`);
        if (Array.isArray(student.neighbours)) {
          student.neighbours.forEach((neighbour, i) => {
            console.log(`    Neighbour ${i + 1}:`);
            console.log(`      LastName: ${neighbour.lastName}`);
            console.log(`      FirstName: ${neighbour.firstName}`);
            console.log(`      Diet: ${neighbour.diet}`);
          });
        }
      });
    } else {
      console.error("Le résultat n'est pas un tableau :", graduatedStudents);
    }
  } catch (error) {
    console.error("Erreur lors du traitement du fichier CSV:", error);
  }

  win.setMenu(null);
  win.center();
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
    console.log('Chemin du fichier sélectionné :', filePath);
    // Call the treatment
    await csvTreatment(filePath);
    return filePath;
  }
});

