// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose only the necessary APIs
contextBridge.exposeInMainWorld('electron', {
    // Window control for custom titlebar
    minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
    maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
    closeWindow: () => ipcRenderer.invoke('window-close'),
    isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),

    // Basic message handling
    sendMessage: (msg) => ipcRenderer.invoke('send-message', msg),
    onMessage: (callback) => {
        const listener = (_, message) => callback(message);
        ipcRenderer.on('message', listener);
        return () => {
            ipcRenderer.removeListener('message', listener);
        };
    },

    // Window maximize/unmaximize event
    onWindowMaximizedChange: (callback) => {
        const listener = (_, isMaximized) => callback(isMaximized);
        ipcRenderer.on('window-maximized', listener);
        return () => {
            ipcRenderer.removeListener('window-maximized', listener);
        };
    }
});