/**
 * @file Preload script for the Electron application.
 * @module preload
 * @description Exposes specific APIs from the main process to the renderer process via contextBridge.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Window Management
  minimize: () => ipcRenderer.send("minimize-window"),
  maximize: () => ipcRenderer.send("maximize-window"),
  close: () => ipcRenderer.send("close-window"),

  // Data Handling
  receivePopupData: (callback) => {
    ipcRenderer.on("popup-data", (event, data) => {
      sessionStorage.setItem("wordData", data);
      callback(JSON.parse(data));
    });
  },
  getStoredWord: () => {
    return JSON.parse(sessionStorage.getItem("wordData") || "{}");
  },

  // Theme Management
  getTheme: () => {
    return localStorage.getItem("theme") || "light";
  },
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
  },

  // Word Lookup
  getMeaning: (word) => {
    console.log(word);
    ipcRenderer.send("get-meaning", word);
  },
  getMeaningWithLoader: (word, setLoading, callback) => {
    setLoading(true);
    ipcRenderer.once("meaning-data", (_, data) => {
      setLoading(false);
      callback(data);
    });
    ipcRenderer.send("get-meaning", word);
  },
  searchWords: (searchTerm, callback) => {
    ipcRenderer.once("search-results", (_, results) => {
      callback(results);
    });
    ipcRenderer.send("search-word", searchTerm);
  },

  // History Management
  saveWord: (word) => {
    ipcRenderer.send("save-word", word);
  },
  getHistory: (callback) => {
    ipcRenderer.on("history-data", (_, data) => {
      callback(data);
    });
  },
  clearHistory: () => {
    ipcRenderer.send("clear-history");
  },

  // Popup Mode
  switchModes: () => {
    ipcRenderer.send("toggle-popup-mode");
  },
  getToolbarMode: (callback) => {
    ipcRenderer.on("popup-mode", (_, mode) => {
      callback(mode);
    });
  },
});
