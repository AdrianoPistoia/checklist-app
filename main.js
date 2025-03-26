const {app, 
  BrowserWindow, 
  ipcMain, 
  globalShortcut } = require('electron');
const fs            = require('fs');
const path          = require('path');

function createWindow() {
  const win = new BrowserWindow({
    y: 0,x: 0,
    fullscreen:         true,
    resizable:          false,
    alwaysOnTop:        true,
    useContentSize:     true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  
      contextIsolation: true,
      nodeIntegration:  false,
    },
    transparent:        true,
    frame:              false  
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.setIgnoreMouseEvents(true, { forward: true });

  globalShortcut.register('Control+Q', () => {
    app.quit(); 
  });

  ipcMain.on('enable-click', () => {
    win.setIgnoreMouseEvents(false); 
  });

  ipcMain.on('disable-click', () => {
    win.setIgnoreMouseEvents(true, { forward: true }); 
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
  
  globalShortcut.unregisterAll();
});
// IPC handlers for saving and loading
ipcMain.on('save-todos', (event, todos) => {
  dialog
    .showSaveDialog(mainWindow, {
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    })
    .then((result) => {
      if (!result.canceled) {
        fs.writeFile(result.filePath, JSON.stringify(todos), (err) => {
          if (err) {
            console.error('Error saving file:', err);
            event.sender.send('save-result', { success: false, error: err.message });
          } else {
            event.sender.send('save-result', { success: true });
          }
        });
      }
    })
    .catch((err) => {
      console.error('Error showing save dialog:', err);
      event.sender.send('save-result', { success: false, error: err.message });
    });
});

ipcMain.on('load-todos', (event) => {
  dialog
    .showOpenDialog(mainWindow, {
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile'],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        fs.readFile(result.filePaths[0], 'utf-8', (err, data) => {
          if (err) {
            console.error('Error loading file:', err);
            event.sender.send('load-result', { success: false, error: err.message });
          } else {
            try {
              const todos = JSON.parse(data);
              event.sender.send('load-result', { success: true, todos: todos });
            } catch (parseError) {
              console.error('Error parsing JSON:', parseError);
              event.sender.send('load-result', { success: false, error: parseError.message });
            }
          }
        });
      }
    })
    .catch((err) => {
      console.error('Error showing open dialog:', err);
      event.sender.send('load-result', { success: false, error: err.message });
    });
});