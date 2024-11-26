const { contextBridge, ipcRenderer } = require('electron');

// Expose the `navigate` function to the renderer process
contextBridge.exposeInMainWorld('api', {
    navigate: (url) => ipcRenderer.send('navigate', url),
});
