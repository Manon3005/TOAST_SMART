const { contextBridge, ipcRenderer } = require("electron");

// On expose une API sécurisée dans `window.electronAPI`
contextBridge.exposeInMainWorld("electronAPI", {
  pickFile: () => ipcRenderer.invoke("dialog:openFile"),
  parseCsvFile: (jsonColumnNames: any) =>
    ipcRenderer.invoke("dialog:beginCsvParsing", jsonColumnNames),
  resolveConflict: (jsonSolution: any) =>
    ipcRenderer.invoke("dialog:resolveConflict", jsonSolution),
  deleteAllConflicts: () => ipcRenderer.invoke("dialog:deleteAllConflicts"),
  addNeighbour: (jsonInfo: any) =>
    ipcRenderer.invoke("dialog:addNeighbour", jsonInfo),
  removeNeighbour: (jsonInfo: any) =>
    ipcRenderer.invoke("dialog:removeNeighbour", jsonInfo),
  generateIntermediateCsv: () =>
    ipcRenderer.invoke("dialog:generateIntermediateCsv"),
  generateTablePlan: (jsonData: any) =>
    ipcRenderer.invoke("dialog:generateTablePlan", jsonData),
  getStatistics: () => ipcRenderer.invoke("dialog:getStatistics"),
  exportTablesCsv: () => ipcRenderer.invoke("dialog:exportTablesCsv"),
  getAllStudent: () => ipcRenderer.invoke("dialog:getAllStudent"),
  getStudentWithConflicts: (jsonSolution: any) =>
    ipcRenderer.invoke("dialog:getStudentWithConflicts", jsonSolution),
});
