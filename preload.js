const { contextBridge, ipcRenderer } = require('electron');

// On expose une API sécurisée dans `window.electronAPI`
contextBridge.exposeInMainWorld('electronAPI', {
  pickFile: () => ipcRenderer.invoke('dialog:openFile'),
});
