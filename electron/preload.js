// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose safe Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Window control for custom titlebar
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  reloadApp: () => ipcRenderer.invoke('app-reload'),
  restartApp: () => ipcRenderer.invoke('app-restart'),
  
  // Dialog APIs
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // File operations
  exportToFile: (data) => ipcRenderer.invoke('export-to-file', data),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // Data persistence
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: (key) => ipcRenderer.invoke('load-data', { key }),
  
  // Event listeners for window events
  onWindowMaximizedChange: (callback) => {
    const listener = (_, isMaximized) => callback(isMaximized);
    ipcRenderer.on('window-maximized', listener);
    return () => {
      ipcRenderer.removeListener('window-maximized', listener);
    };
  },
  
  // Event listeners for menu actions
  onMenuNewRequest: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-new-request', listener);
    return () => {
      ipcRenderer.removeListener('menu-new-request', listener);
    };
  },
  
  onMenuSendRequest: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-send-request', listener);
    return () => {
      ipcRenderer.removeListener('menu-send-request', listener);
    };
  },
  
  onMenuClearResponse: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-clear-response', listener);
    return () => {
      ipcRenderer.removeListener('menu-clear-response', listener);
    };
  },
  
  onMenuFormatJson: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-format-json', listener);
    return () => {
      ipcRenderer.removeListener('menu-format-json', listener);
    };
  },
  
  onMenuImportCollection: (callback) => {
    const listener = (_, filePath) => callback(filePath);
    ipcRenderer.on('menu-import-collection', listener);
    return () => {
      ipcRenderer.removeListener('menu-import-collection', listener);
    };
  },
  
  onMenuExportCollection: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-export-collection', listener);
    return () => {
      ipcRenderer.removeListener('menu-export-collection', listener);
    };
  },
  
  onMenuOpenSettings: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-open-settings', listener);
    return () => {
      ipcRenderer.removeListener('menu-open-settings', listener);
    };
  },
  
  onMenuAbout: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('menu-about', listener);
    return () => {
      ipcRenderer.removeListener('menu-about', listener);
    };
  }
});