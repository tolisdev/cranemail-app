const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('popupAPI', {
  onPopupType: (callback) => ipcRenderer.on('popup-type', callback),
  sendClearCookies: () => ipcRenderer.send('clear-cookies'),
  sendQuitApp: () => ipcRenderer.send('quit-app'),
  closeWindow: () => ipcRenderer.send('close-popup')
});
