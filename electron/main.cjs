const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 720,
    title: 'AASHTO LRFD (2020) & FHWA GEC-7 Soil Nail Design Suite - Portable Edition',
    icon: path.join(__dirname, '../public/app-icon.png'),
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
    show: false,
  });

  // Try to load dist/index.html or dev server
  const distPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath);
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Native application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project (Ctrl+N)',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:new-project"))');
          },
        },
        {
          label: 'Open Project (*.SNDA)...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:open-project"))');
          },
        },
        {
          label: 'Save Project (*.SNDA)',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:save-project"))');
          },
        },
        { type: 'separator' },
        {
          label: 'Export PDF / Print Calculation Report...',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:open-report"))');
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit Application' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Refresh (F5)' },
        { role: 'forceReload', label: 'Force Refresh (Ctrl+F5)' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Default Zoom' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen (F11)' },
      ],
    },
    {
      label: 'Design & Tools',
      submenu: [
        {
          label: 'Soil Nail LRFD Design Calculations',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:navigate-calc"))');
          },
        },
        {
          label: 'FHWA-NHI-14-007 Step-by-Step Guidance',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:navigate-guide"))');
          },
        },
        {
          label: 'CAD Cross-Section & Details',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:navigate-cad"))');
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Engineering Standards (FHWA GEC-7 / AASHTO LRFD)',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("snda:navigate-refs"))');
          },
        },
        { type: 'separator' },
        {
          label: 'About Soil Nail Wall Design Suite',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Soil Nail Wall Design Suite',
              message: 'Soil Nail Wall Design Suite - Portable Windows Edition\nVersion 1.0.0 (Standalone Portable)',
              detail: 'Complies with AASHTO LRFD Bridge Design Specifications (9th Ed., 2020) and FHWA-NHI-14-007 (GEC-7).\nRuns 100% offline with zero dependencies.',
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
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
