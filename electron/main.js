// electron/main.js
const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const Store = require("electron-store");

// Initialize the store for app settings
const store = new Store();

// Development vs Production environment
const isDev = process.env.NODE_ENV !== "production";
console.log(`Running in ${isDev ? "development" : "production"} mode`);

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// Window dimensions
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;
const MIN_WIDTH = 940;
const MIN_HEIGHT = 600;

function createMainWindow() {
  // Load saved window position and dimensions
  const windowState = store.get("windowState", {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    x: undefined,
    y: undefined,
  });

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false, // Remove default window frame for custom titlebar
    titleBarStyle: "hidden",
    backgroundColor: "#191515", // Match APIONIX dark theme background
    show: false, // Don't show until loaded
  });

  // Save window position and dimensions when window is closed
  const saveWindowState = () => {
    if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
      const position = mainWindow.getPosition();
      const size = mainWindow.getSize();
      store.set("windowState", {
        width: size[0],
        height: size[1],
        x: position[0],
        y: position[1],
      });
    }
    store.set("windowState.isMaximized", mainWindow.isMaximized());
  };

  // Add window state listeners
  mainWindow.on("resize", saveWindowState);
  mainWindow.on("move", saveWindowState);
  mainWindow.on("close", saveWindowState);

  // Load the app
  const startUrl = isDev
    ? "http://localhost:3000" // Development server URL
    : `file://${path.join(__dirname, "../renderer/out/index.html")}`; // Production build path

  console.log(`Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    
    // Restore maximized state if applicable
    if (store.get("windowState.isMaximized", false)) {
      mainWindow.maximize();
    }
    
    // Open DevTools in development mode
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window close
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external URLs in the default browser
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
  
  // Inform the renderer when window maximize/unmaximize state changes
  mainWindow.on("maximize", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("window-maximized", true);
    }
  });
  
  mainWindow.on("unmaximize", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("window-maximized", false);
    }
  });
}

// Create the application menu
function createApplicationMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Request",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-new-request");
            }
          },
        },
        { type: "separator" },
        {
          label: "Import Collection",
          click: async () => {
            if (!mainWindow) return;
            
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [
                { name: "JSON Files", extensions: ["json"] },
                { name: "All Files", extensions: ["*"] },
              ],
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send("menu-import-collection", result.filePaths[0]);
            }
          },
        },
        {
          label: "Export Collection",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-export-collection");
            }
          },
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-open-settings");
            }
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { type: "separator" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        { type: "separator" },
        {
          label: "Developer Tools",
          accelerator: process.platform === "darwin" ? "Cmd+Alt+I" : "Ctrl+Shift+I",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: "Request",
      submenu: [
        {
          label: "Send Request",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-send-request");
            }
          },
        },
        {
          label: "Clear Response",
          accelerator: "CmdOrCtrl+L",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-clear-response");
            }
          },
        },
        { type: "separator" },
        {
          label: "Format JSON",
          accelerator: "CmdOrCtrl+Shift+F",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-format-json");
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About APIONIX",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu-about");
            }
          },
        },
        {
          label: "Documentation",
          click: () => {
            shell.openExternal("https://github.com/tetrax-repo/apionix");
          },
        },
        {
          label: "Report Issue",
          click: () => {
            shell.openExternal("https://github.com/tetrax-repo/apionix/issues");
          },
        },
      ],
    },
  ];

  // Add macOS specific menu items
  if (process.platform === "darwin") {
    template.unshift({
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers for main process / renderer communication
function setupIpcHandlers() {
  // Get app info
  ipcMain.handle("get-app-info", () => {
    return {
      version: app.getVersion(),
      platform: process.platform,
      isDev: isDev,
      appPath: app.getAppPath(),
      userDataPath: app.getPath("userData"),
    };
  });

  // Window control handlers for custom titlebar
  ipcMain.handle("window-minimize", () => {
    if (mainWindow) {
      mainWindow.minimize();
      return true;
    }
    return false;
  });

  ipcMain.handle("window-maximize", () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
        return false; // Return false to indicate window is now unmaximized
      } else {
        mainWindow.maximize();
        return true; // Return true to indicate window is now maximized
      }
    }
    return false;
  });

  ipcMain.handle("window-close", () => {
    if (mainWindow) {
      mainWindow.close();
      return true;
    }
    return false;
  });

  ipcMain.handle("window-is-maximized", () => {
    if (mainWindow) {
      return mainWindow.isMaximized();
    }
    return false;
  });

  // System dialog for message boxes
  ipcMain.handle("show-message-box", async (event, options) => {
    return await dialog.showMessageBox(mainWindow, options);
  });

  // System dialog for file saving
  ipcMain.handle("show-save-dialog", async (event, options) => {
    return await dialog.showSaveDialog(mainWindow, options);
  });

  // System dialog for file opening
  ipcMain.handle("show-open-dialog", async (event, options) => {
    return await dialog.showOpenDialog(mainWindow, options);
  });

  // Save/export data to file
  ipcMain.handle("export-to-file", async (event, { content, filePath }) => {
    try {
      fs.writeFileSync(filePath, content, "utf8");
      return { success: true };
    } catch (error) {
      console.error("Failed to export file:", error);
      return { success: false, error: error.message };
    }
  });

  // Read imported file
  ipcMain.handle("read-file", async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      return { success: true, content };
    } catch (error) {
      console.error("Failed to read file:", error);
      return { success: false, error: error.message };
    }
  });

  // Generic data persistence
  ipcMain.handle("save-data", async (event, { key, data }) => {
    try {
      store.set(key, data);
      return { success: true };
    } catch (error) {
      console.error(`Failed to save data for key '${key}':`, error);
      return { success: false, error: error.message };
    }
  });

  // Load saved data
  ipcMain.handle("load-data", async (event, { key }) => {
    try {
      const data = store.get(key);
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to load data for key '${key}':`, error);
      return { success: false, error: error.message };
    }
  });
  
  // Reload application
  ipcMain.handle("app-reload", () => {
    if (mainWindow) {
      mainWindow.reload();
      return true;
    }
    return false;
  });
  
  // Restart application
  ipcMain.handle("app-restart", () => {
    app.relaunch();
    app.exit(0);
    return true;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();
  createApplicationMenu();
  setupIpcHandlers();

  // Handle macOS app activation
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit the app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  
  // Show error dialog if the app is running
  if (mainWindow) {
    dialog.showErrorBox(
      "An error occurred",
      `An unexpected error occurred in the application:\n\n${error.message}`
    );
  }
});