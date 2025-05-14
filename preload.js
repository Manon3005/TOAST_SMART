const { contextBridge, ipcRenderer } = require('electron');

// On expose une API sécurisée dans `window.electronAPI`
contextBridge.exposeInMainWorld('electronAPI', {
  pickFile: () => ipcRenderer.invoke('dialog:openFile'),
  parseCsvFile: (jsonColumnNames) => ipcRenderer.invoke('dialog:beginCsvParsing', jsonColumnNames),
  getNextConflict: (jsonSolution) => ipcRenderer.invoke('dialog:getNextConflict', jsonSolution), 
  addNeighbour: (jsonInfo) => ipcRenderer.invoke('dialog:addStudent', jsonInfo),
  generateIntermediateCsv: () => ipcRenderer.invoke('dialog:generateIntermediateCsv'),
  generateTablePlan: (jsonData) => ipcRenderer.invoke('dialog:generateTablePlan', jsonData),
  getStatistics: () => ipcRenderer.invoke('dialog:getStatistics'),
  exportTablesCsv: () => ipcRenderer.invoke('dialog:exportTablesCsv'),
});
