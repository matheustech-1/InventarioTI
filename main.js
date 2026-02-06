const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const executableRelativePath = path.join("app", "bin", "inventario.exe");

function runExecutable() {
  const exePath = path.join(__dirname, executableRelativePath);
  const child = spawn(exePath, [], { detached: true, windowsHide: true });

  child.on("error", (err) => {
    dialog.showErrorBox(
      "Falha ao executar",
      `Não foi possível executar ${exePath}.\n\n${err.message}`
    );
  });

  child.unref();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#0f1b1a",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "inventario.html"));
}

app.whenReady().then(() => {
  createWindow();
  runExecutable();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("run-executable", () => {
  runExecutable();
});
