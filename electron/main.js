const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const fs = require('fs');

// Setup logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: Math.min(width, 1400),
    height: Math.min(height, 900),
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  // Optionally open dev tools
  // mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    log.info('Main window is ready to show.');
    autoUpdater.checkForUpdatesAndNotify()
      .catch(err => {
        log.error('Error checking for updates: ' + err);
      });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  mainWindow.webContents.send('update-checking');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater: ' + err);
  mainWindow.webContents.send('update-error', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  log.info(log_message);
  mainWindow.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded');
  mainWindow.webContents.send('update-downloaded');
});

// Handle install update request from renderer process
ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

const userDataPath = app.getPath('userData');
log.info('userDataPath starting...');
log.info(userDataPath);

// // Handle file caching
// ipcMain.handle('cache-file', async (event, fileBuffer, fileName) => {
//   const cacheDir = path.join(app.getPath('userData'), 'fbxCache');
//   const cachedFilePath = path.join(cacheDir, fileName);

//   if (!fs.existsSync(cacheDir)) {
//     fs.mkdirSync(cacheDir);
//   }

//   if (!fs.existsSync(cachedFilePath)) {
//     fs.writeFileSync(cachedFilePath, Buffer.from(fileBuffer));
//   }

//   return cachedFilePath;
// });

// ipcMain.handle('load-cached-file', (event, fileName) => {
//   const cacheDir = path.join(app.getPath('userData'), 'fbxCache');
//   const cachedFilePath = path.join(cacheDir, fileName);

//   if (fs.existsSync(cachedFilePath)) {
//     return cachedFilePath;
//   } else {
//     return null;
//   }
// });

ipcMain.handle('save-to-cache', async (event, { buffer, name }) => {
  const cacheDir = path.join(os.homedir(), '.mes-app-cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  const cachedFilePath = path.join(cacheDir, name);

  // Save buffer to cache directory
  fs.writeFileSync(cachedFilePath, Buffer.from(buffer));

  return cachedFilePath;
});
