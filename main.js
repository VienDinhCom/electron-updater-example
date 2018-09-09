const {app, BrowserWindow } = require('electron');
const {autoUpdater} = require("electron-updater");
const updateMac = require('./udpdate');

let win;

autoUpdater.on('checking-for-update', () => {
  win.webContents.send('message', 'Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  win.webContents.send('message', 'Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  win.webContents.send('message', 'Update not available.');
})

autoUpdater.on('download-progress', (progressObj) => {
  
})

autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('message', 'Update downloaded');
  updateMac(app);
});

app.on('ready', function() {
  win = new BrowserWindow();
  // win.webContents.openDevTools();
  win.on('closed', () => win = null);
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);

  win.webContents.on('did-finish-load', () => {
    if (!win) return;
    win.show();
    win.focus();
  });

  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  app.quit();
});