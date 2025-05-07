const { contextBridge, ipcRenderer } = require('electron');

// On expose une API sécurisée dans `window.electronAPI`
contextBridge.exposeInMainWorld('electronAPI', {
  pickFile: () => ipcRenderer.invoke('dialog:openFile'),
  parseCsvFile: () => ipcRenderer.invoke('dialog:beginCsvParsing'),
  generateTablePlan: (jsonData) => ipcRenderer.invoke('dialog:generateTablePlan'),
});
