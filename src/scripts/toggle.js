const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const toggleFilePath = path.join(app.getPath("userData"), "toggleState.json");

/**
 * Save the toggle state to a file.
 * @param {boolean} state - The state to save.
 */
function saveToggleState(state) {
  fs.writeFileSync(toggleFilePath, JSON.stringify({ popupMode: state }));
}

/**
 * Get the toggle state from the file.
 * @returns {boolean} The saved toggle state.
 */
function getToggleState() {
  if (fs.existsSync(toggleFilePath)) {
    const data = fs.readFileSync(toggleFilePath);
    return JSON.parse(data).popupMode;
  }
  return true; // default to popup mode
}

module.exports = { saveToggleState, getToggleState };
