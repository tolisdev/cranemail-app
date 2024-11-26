const { app, BrowserWindow, BrowserView, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;
let view;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Remove the default menu bar
    Menu.setApplicationMenu(null);

    // Load the index.html with the navbar
    mainWindow.loadFile('index.html');

    // Set zoom level to 90%
    mainWindow.webContents.setZoomFactor(0.85);

    // Create the BrowserView that will contain the web pages
    view = new BrowserView();
    mainWindow.setBrowserView(view);

    // Set initial bounds for BrowserView (takes the full window minus the navbar height)
    updateViewBounds();

    // Default to loading the Workspace page
    view.webContents.loadURL('https://workspace.org');
    
    // Handle navigation requests from renderer
    ipcMain.on('navigate', (event, url) => {
        view.webContents.loadURL(url);
    });

    // Listen for window resize events to adjust BrowserView size
    mainWindow.on('resize', () => {
        updateViewBounds();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Function to dynamically update the BrowserView bounds
function updateViewBounds() {
    const [width, height] = mainWindow.getSize();
    // The navbar is 50px tall, adjust as needed if the navbar height changes
    view.setBounds({ x: 0, y: 50, width: width - 50, height: height - 100 });
}
