const { BrowserWindow, screen, Tray, app, Menu } = require("electron");
const path = require("path");
const { getToggleState, saveToggleState } = require("./toggle");
const { getHistory } = require("./history");
const { log } = require("console");

let popupWindow;
let tray = null;
/**
 * Show the popup window with the provided data.
 * @param {Object} data - The data to display in the popup.
 */
function showPopup(data) {
  let popupMode = getToggleState();
  try {
    if (popupWindow) {
      popupWindow.close();
      popupWindow = null;
    }
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const adjustedWidth = Math.min(width * 0.8, 800);
    const adjustedHeight = Math.min(height * 0.8, 600);
    const popupOptions = {
      width: popupMode ? adjustedWidth : 600,
      height: popupMode ? adjustedHeight : 310,
      frame: false,
      alwaysOnTop: !popupMode,
      transparent: false,
      resizable: popupMode,
      fullscreen: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        disableHtmlFullscreenWindowResize: true,
        preload: path.join(__dirname, "preload.js"),
      },
      devTools: false,
      enableRemoteModule: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      plugins: false,
      sandbox: true,
      contextIsolation: true,
      webviewTag: false,
    };

    popupWindow = new BrowserWindow(popupOptions);

    popupWindow.webContents.on("before-input-event", (event, input) => {
      const allowedKeys = ["c", "v", "+", "-", "=", "a", "x", "z", "d"];
      if (input.control || input.meta) {
        if (allowedKeys.includes(input.key)) return;
        event.preventDefault();
      }
    });

    popupWindow.webContents.on("will-navigate", (event) => {
      event.preventDefault();
    });

    popupWindow.webContents.on("new-window", (event) => {
      event.preventDefault();
    });

    popupWindow.loadFile(path.join(__dirname, "../../dist/index.html"));

    popupWindow.webContents.once("did-finish-load", async () => {
      try {
        popupWindow.webContents.send("popup-mode", getToggleState());
        popupWindow.webContents.send("popup-data", JSON.stringify(data));
        popupWindow.webContents.send("history-data", await getHistory());
      } catch (error) {
        console.error("Error sending data to popup:", error);
      }
    });

    tray = new Tray(path.join(__dirname, "../assets/icon.ico"));

    const contextMenu = Menu.buildFromTemplate([
      { label: "Show App", click: () => popupWindow.show() },
      {
        label: "restart",
        click: () => {
          restart();
        },
      },
      {
        label: "Quit",
        click: () => {
          tray.destroy();
          app.quit();
        },
      },
    ]);

    tray.setContextMenu(contextMenu);
    tray.on("click", () => {
      popupWindow.show(); 
    });

    popupWindow.on("close", (event) => {
      event.preventDefault();
      popupWindow.hide();
    });
    
    popupWindow.on("closed", () => {
      popupWindow = null;
    });
  } catch (error) {
    console.error("Error showing popup:", error);
  }
}

/**
 * Check if the popup window is active.
 * @returns {boolean} True if the popup window is active, false otherwise.
 */
function isPopupWindowActive() {
  return !!popupWindow;
}

/**
 * Get the popup window instance.
 * @returns {BrowserWindow|null} The popup window instance or null if not available.
 */
function getPopupWindow() {
  return popupWindow;
}

/**
 * Check if the tray icon is active.
 * @returns {boolean} True if the tray icon is active, false otherwise.
 */
function isTrayActive() {
  return !!tray;
}

/**
 * Get the tray instance.
 * @returns {Tray|null} The tray instance or null if not available.
 */
function getTray() {
  return tray;
}

/**
 * Restart the application.
 */
function restart() {
  tray.destroy();
  app.relaunch();
  app.exit();
}
module.exports = { showPopup, isPopupWindowActive, getPopupWindow, isTrayActive, getTray, restart};
