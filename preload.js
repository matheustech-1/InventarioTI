const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  runExecutable: () => ipcRenderer.invoke("run-executable"),
});
