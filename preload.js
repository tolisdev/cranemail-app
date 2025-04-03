const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  navigate: (url) => ipcRenderer.send('navigate', url),
  openPopup: (popupType) => ipcRenderer.send('open-popup', popupType),
  clearBrowserViewData: () => ipcRenderer.invoke('clear-browserview-data')
});
