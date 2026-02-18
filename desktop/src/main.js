const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    backgroundColor: '#0a0a0f',
  });

  // Load the web app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../assets/icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Admin Dashboard',
      click: () => {
        const adminWindow = new BrowserWindow({
          width: 1200,
          height: 800,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          },
          backgroundColor: '#0a0a0f',
        });
        adminWindow.loadFile(path.join(__dirname, '../renderer/admin.html'));
      },
    },
    { type: 'separator' },
    {
      label: 'View Stats',
      click: async () => {
        // Show notification with quick stats
        const { Notification } = require('electron');
        new Notification({
          title: 'Platform Stats',
          body: 'Users: 1234 | Transactions: 5678',
        }).show();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Agentic Admin');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

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

app.on('before-quit', () => {
  app.isQuitting = true;
});

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', async () => {
  // Auto-update logic would go here
  return { available: false };
});

// Admin IPC handlers
ipcMain.handle('get-admin-stats', async () => {
  // In production, this would make an API call to the backend
  try {
    // Mock data for now - would fetch from Supabase in production
    return {
      totalUsers: 1234,
      totalTransactions: 5678,
      totalTokens: 89,
      totalValue: 3500000,
    };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return {
      totalUsers: 0,
      totalTransactions: 0,
      totalTokens: 0,
      totalValue: 0,
    };
  }
});

ipcMain.handle('get-recent-activity', async () => {
  // Mock data - would fetch from Supabase in production
  return [
    { action: 'New user registration', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Token transfer', user: 'alice@example.com', time: '5 minutes ago' },
    { action: 'NFT minted', user: 'bob@example.com', time: '10 minutes ago' },
  ];
});

ipcMain.handle('open-admin-dashboard', () => {
  // Create admin dashboard window
  const adminWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#0a0a0f',
  });

  adminWindow.loadFile(path.join(__dirname, '../renderer/admin.html'));
  return true;
});
