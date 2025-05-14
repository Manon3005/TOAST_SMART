const { contextBridge, ipcRenderer } = require('electron');

// On expose une API sécurisée dans `window.electronAPI`
contextBridge.exposeInMainWorld('electronAPI', {
  pickFile: () => ipcRenderer.invoke('dialog:openFile'),
  parseCsvFile: (jsonColumnNames) => ipcRenderer.invoke('dialog:beginCsvParsing', jsonColumnNames),
  getNextConflict: (jsonSolution) => ipcRenderer.invoke('dialog:getNextConflict', jsonSolution), 
  generateTablePlan: (jsonData) => ipcRenderer.invoke('dialog:generateTablePlan', jsonData),
});
