// main.js
const { app, BrowserWindow, globalShortcut, clipboard } = require("electron");
const path = require("path");
const FetchDictionaryAPI = require("./src/scripts/fetch");
const { saveWord, getHistory, clearHistory } = require("./src/scripts/history");
const { ipcMain } = require("electron");
const searchWords = require("./src/scripts/search");
const { saveToggleState, getToggleState } = require("./src/scripts/toggle");
const { registerGlobalShortcut } = require("./src/scripts/captureText");
const {
  showPopup,
  getPopupWindow,
  getTray,
  restart,
} = require("./src/scripts/showPopup");
const { initialize } = require("./src/scripts/initialize");
const { log } = require("console");

const fetchDictionaryAPI = new FetchDictionaryAPI();
// Ensure only one instance of the app runs
const gotTheLock = app.requestSingleInstanceLock();

let popupMode = getToggleState();

if (!gotTheLock) {
  app.quit();
} else {
  /**
   * Handle second instance of the app.
   * @param {Event} event - The event object.
   * @param {string[]} commandLine - The command line arguments.
   * @param {string} workingDirectory - The working directory.
   */
  app.on("second-instance", async (event, commandLine, workingDirectory) => {
    const popupWindow = getPopupWindow();
    if (popupWindow) {
      if (popupWindow.isMinimized()) popupWindow.restore();
      popupWindow.focus();
    } else {
      const word = process.argv[2];
      if (word) {
        const data = await fetchDictionaryAPI.fetchData(word);
        showPopup(data);
      }
    }
  });

  /**
   * Create the popup window when the app is ready.
   */
  app.on("ready", async () => {
    log("App is ready");
    await registerGlobalShortcut();
    initialize();
  });

  /**
   * Quit the app when all windows are closed.
   */
  app.on("window-all-closed", (event) => {
    event.preventDefault();
  });

  /**
   * Reinitialize the app when activated.
   */
  app.on("activate", async () => {
    log("App is activated");
    const popupWindow = getPopupWindow();
    if (popupWindow === null) {
      initialize();
    }
  });
}

/**
 * Toggle popup mode.
 * @param {Event} event - The event object.
 */
ipcMain.on("toggle-popup-mode", (event) => {
  popupMode = !popupMode;
  saveToggleState(popupMode);
  setTimeout(() => {
    restart();
  }, 500);
});

/**
 * Search for a word.
 * @param {Event} event - The event object.
 * @param {string} searchTerm - The search term.
 */
ipcMain.on("search-word", async (event, searchTerm) => {
  const results = searchWords(searchTerm);
  event.sender.send("search-results", results);
  event.sender.send("history-data", await getHistory());
});

/**
 * Minimize the current window.
 */
ipcMain.on("minimize-window", () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

/**
 * Maximize or unmaximize the current window.
 */
ipcMain.on("maximize-window", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});

/**
 * Close the current window.
 */
ipcMain.on("close-window", () => {
  BrowserWindow.getFocusedWindow()?.close();
});

/**
 * Clear the search history.
 * @param {Event} event - The event object.
 */
ipcMain.on("clear-history", async (event) => {
  try {
    await clearHistory();
    event.sender.send("history-data", await getHistory());
  } catch (e) {
    console.log(e);
  }
});

/**
 * Get the meaning of a word.
 * @param {Event} event - The event object.
 * @param {string} word - The word to get the meaning of.
 */
ipcMain.on("get-meaning", async (event, word) => {
  const meaning = await fetchDictionaryAPI.fetchData(word);
  event.sender.send("popup-data", JSON.stringify(meaning));
  await saveWord(word);
  event.sender.send("history-data", await getHistory());
});

/**
 * Save a word to the history.
 * @param {Event} event - The event object.
 * @param {string} word - The word to save.
 */
ipcMain.on("save-word", async (event, word) => {
  await saveWord(word);
  event.sender.send("history-data", await getHistory());
});


