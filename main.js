const {app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');  // Import 'path' module

function createWindow() {
  const win = new BrowserWindow({
    y: 0,
    x: 0,
    fullscreen:true,
    resizable: false,
    useContentSize: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  
      contextIsolation: false,
      nodeIntegration: true,
    },
    transparent: true,
    frame: false  
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.setIgnoreMouseEvents(true, { forward: true });

  globalShortcut.register('Control+Q', () => {
    app.quit(); // Closes the application
  });

  ipcMain.on('enable-click', () => {
    win.setIgnoreMouseEvents(false); // Enable interactions
  });

  ipcMain.on('disable-click', () => {
    win.setIgnoreMouseEvents(true, { forward: true }); // Disable interactions
  });
}


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});