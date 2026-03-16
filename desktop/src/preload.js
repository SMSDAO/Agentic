/**
 * Electron preload script.
 *
 * Runs in an isolated context with access to a limited subset of Node APIs.
 * Exposes a safe `window.electronAPI` bridge to the renderer process.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /** Returns the packaged app version string. */
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  /** Checks whether an auto-update is available. */
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
});
