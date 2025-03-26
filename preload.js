const { ipcRenderer,contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  const slidingWindow = document.getElementById('tab'); 
  const saveButton = document.getElementById("save-button");
  
  slidingWindow.addEventListener('mouseenter', () => {
    ipcRenderer.send('enable-click');
  });

  slidingWindow.addEventListener('mouseleave', () => {
    ipcRenderer.send('disable-click');
  });


  contextBridge.exposeInMainWorld('electronAPI', {
    saveTodos: (todos) => ipcRenderer.send('save-todos', todos),
    loadTodos: () => ipcRenderer.send('load-todos'),
    onSaveResult: (callback) => ipcRenderer.on('save-result', callback),
    onLoadResult: (callback) => ipcRenderer.on('load-result', callback),
        openFile: (filePath) => ipcRenderer.send('open-file', filePath),
    enableClick: () => ipcRenderer.send('enable-click'), //expose enableClick
    disableClick: () => ipcRenderer.send('disable-click'), //expose disableClick
  });
});
