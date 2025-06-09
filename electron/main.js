// electron/main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Development vs Production environment
const isDev = process.env.NODE_ENV !== "production";
console.log(`Running in ${isDev ? "development" : "production"} mode`);

// Keep a global reference of the window object
let mainWindow;

function createMainWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 940,
        minHeight: 600,

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        frame: false, // Remove default window frame for custom titlebar
        backgroundColor: "#191515", // Match APIONIX dark theme background
        show: false, // Don't show until loaded
    });

    // Load the app
    const startUrl = isDev ?
        "http://localhost:3000" // Development server URL
        :
        `file://${path.join(__dirname, "../renderer/out/index.html")}`; // Production build path

    console.log(`Loading URL: ${startUrl}`);
    mainWindow.loadURL(startUrl);

    // Show window when ready
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();

        // Open DevTools in development mode
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
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

// Set up IPC handlers for window control
function setupIpcHandlers() {
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
                return false; // Window is now unmaximized
            } else {
                mainWindow.maximize();
                return true; // Window is now maximized
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

    // Basic message handler
    ipcMain.handle("send-message", (event, message) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("message", message);
        }
        return true;
    });
}

// App lifecycle
app.whenReady().then(() => {
    createMainWindow();
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