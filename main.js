const { ParserService } = require("./backend/dist/backend/services/ParserService.js");
const { GraduatedStudent } = require("./backend/dist/backend/business/Objects.js")

const { app, BrowserWindow } = require('electron/main')

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
  try {
    const graduatedStudents = await ParserService.readFileCSV("resources/files/export_pr_plan.csv");

    if (Array.isArray(graduatedStudents)) {
      graduatedStudents.forEach((student, index) => {
        console.log(`Student ${index + 1}:`);
        console.log(`  LastName: ${student.lastName}`);
        console.log(`  FirstName: ${student.firstName}`);
        console.log(`  Email: ${student.email}`);
        console.log(`  Diet: ${student.diet}`);
        console.log(`  Neighbours: ${student.neighbours}`);
        if (Array.isArray(student.guests)) {
          student.guests.forEach((guest, i) => {
            console.log(`    Guest ${i + 1}:`);
            console.log(`      LastName: ${guest.lastName}`);
            console.log(`      FirstName: ${guest.firstName}`);
            console.log(`      Diet: ${guest.diet}`);
          });
        }
      });
    } else {
      console.error("Le résultat n'est pas un tableau :", graduatedStudents);
    }

  } catch (error) {
    console.error("Erreur lors du traitement du fichier CSV:", error);
  }
  win.loadFile('index.html')
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