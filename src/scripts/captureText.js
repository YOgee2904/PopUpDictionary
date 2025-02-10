const { clipboard, globalShortcut } = require("electron");
const { keyboard, Key, sleep } = require("@nut-tree-fork/nut-js");
const {
  getPopupWindow,
  showPopup,
  isPopupWindowActive,
} = require("./showPopup");
const { cleanSelectedText } = require("./helper/utils");
const FetchDictionaryAPI = require("./fetch");
const { saveWord, getHistory } = require("./history");

/**
 * Initialize the dictionary API.
 */
const fetchDictionaryAPI = new FetchDictionaryAPI();

/**
 * Capture the selected text from the clipboard.
 * @returns {Promise<string>} The captured text.
 */
async function captureSelectedText() {
  return new Promise(async (resolve) => {
    const previousClipboard = clipboard.readText();
    await keyboard.pressKey(Key.LeftControl, Key.C);
    await sleep(100);
    await keyboard.releaseKey(Key.LeftControl, Key.C);
    const selectedText = clipboard.readText();
    clipboard.writeText(previousClipboard);
    resolve(selectedText !== previousClipboard ? selectedText : "");
  });
}

/**
 * Register a global shortcut to capture selected text and show the popup.
 */
async function registerGlobalShortcut() {
  globalShortcut.register("Ctrl+Alt+Shift+D", async () => {
    try {
      const selectedText = await captureSelectedText();
      const cleanedText = cleanSelectedText(selectedText);
      if (cleanedText) {
        const data = await fetchDictionaryAPI.fetchData(cleanedText);
        const popupWindow = getPopupWindow();
        if (popupWindow) {
          if (!popupWindow.isVisible()) {
            popupWindow.show();
          }
          if (popupWindow.isMinimized()) {
            popupWindow.restore(); // Restore if minimized
          }
          popupWindow.focus(); // Bring it to front
          await saveWord(cleanedText);
          popupWindow.webContents.send("history-data", await getHistory());
          popupWindow.webContents.send("popup-data", JSON.stringify(data));
        } else {
          showPopup(data);
        }
      }
    } catch (error) {
      console.error("Error capturing text:", error);
    }
  });
}

module.exports = { captureSelectedText, registerGlobalShortcut };
