// const { app, BrowserWindow, ipcMain, shell } = require('electron');
// const path = require('path');

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1280,
//     height: 800,
//     minWidth: 900,
//     minHeight: 600,
//     show: false,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true,
//       nodeIntegration: false,
//       sandbox: false
//     },
//     autoHideMenuBar: false
//   });

//   // Load local index.html
//   mainWindow.loadFile(path.join(__dirname, 'index.html'));

//   // Show when ready (prevents white flash)
//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   // Optional: open devtools when in development
//   if (process.env.ELECTRON_START_URL || process.env.NODE_ENV === 'development') {
//     mainWindow.webContents.openDevTools();
//   }

//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', function () {
//   // On macOS it's common for apps to stay open until user quits explicitly
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// // Example: allow opening external links in default browser
// ipcMain.handle('open-external', async (event, url) => {
//   try {
//     await shell.openExternal(url);
//     return { ok: true };
//   } catch (err) {
//     return { ok: false, error: String(err) };
//   }
// });