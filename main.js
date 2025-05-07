const { ParserService } = require("./backend/dist/backend/services/ParserService.js");
const { GraduatedStudent } = require("./backend/dist/backend/business/Objects.js")
const path = require('path')
const { app, BrowserWindow } = require('electron/main');
const { Parser } = require("csv-parse");
const { ipcMain, dialog } = require('electron');

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  try {
    ParserService.setColumnsNames({
      firstName: "Prenom",
      lastName: "Nom",
      buyerfirstName: "Prenom acheteur",
      buyerlastName: "Nom acheteur",
      buyerEmail: "E-mail acheteur",
      diet: "Regime alimentaire #131474",
      wantedTableMates: "Avec qui voulez-vous manger? (commande) #135122",
    });
    
    await ParserService.readFileCSV("resources/files/export_pr_plan_virgule.csv");
    const graduatedStudents = await ParserService.linkNeighboursToGraduatedStudents();
    if (Array.isArray(graduatedStudents)) {
      console.log(graduatedStudents);
      graduatedStudents.forEach((student, index) => {
        console.log(`Student ${index + 1}:`);
        console.log(`  LastName: ${student.lastName}`);
        console.log(`  FirstName: ${student.firstName}`);
        console.log(`  Email: ${student.email}`);
        console.log(`  Diet: ${student.diet}`);
        console.log(`  Number of Guests: ${student.nbGuest}`)
        if (Array.isArray(student.guests)) {
          student.guests.forEach((guest, i) => {
            console.log(`    Guest ${i + 1}:`);
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
    return filePath;
  }
});

