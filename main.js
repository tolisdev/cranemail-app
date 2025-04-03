const { app, BrowserWindow, BrowserView, ipcMain, session, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let view;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'crane.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile('index.html');
  mainWindow.webContents.setZoomFactor(0.8);

  // Create a BrowserView for main content with persistent cookies.
  view = new BrowserView({ webPreferences: { partition: 'persist:persistent' } });
  mainWindow.setBrowserView(view);
  updateViewBounds();
  view.webContents.loadURL('https://workspace.org');

  ipcMain.on('navigate', (event, url) => {
    view.webContents.loadURL(url);
  });

  // Open a modal popup for info or logout.
  ipcMain.on('open-popup', (event, popupType) => {
    const popup = new BrowserWindow({
      width: 350,
      height: 250,
      modal: true,
      parent: mainWindow,
      frame: false,
      // Solid background (no transparency)
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, 'popupPreload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    popup.loadFile('popup.html');
    popup.webContents.once('did-finish-load', () => {
      popup.webContents.send('popup-type', popupType);
    });
  });

  ipcMain.on('close-popup', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.close();
    }
  });

  ipcMain.on('clear-cookies', async (event) => {
    try {
      const partitionPath = path.join(app.getPath('userData'), 'Partitions', 'persistent');
      console.log('Partition Path:', partitionPath);
      const customSession = session.fromPartition('persist:persistent');
      customSession.clearStorageData([], (data) => {
        console.log('Storage Data Cleared:', data);
      });
  
    } catch (error) {
      console.error('Failed to clear cookies:', error);
      event.reply('cookies-cleared', false);
    }
  });
  
  
  

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  mainWindow.on('resize', updateViewBounds);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function updateViewBounds() {
  const [width, height] = mainWindow.getSize();
  view.setBounds({ x: 0, y: 40, width, height: height - 40 });
}
