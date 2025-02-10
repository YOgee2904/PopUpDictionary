const { log } = require("console");
const { app } = require("electron");
const fs = require("fs");
const path = require("path");

const historyFilePath = path.join(app.getPath('userData'), 'history.json');

/**
 * Save a word to the history file.
 * @param {string} word - The word to save.
 */
async function saveWord(word) {
  let history = [];
  try {
    if (fs.existsSync(historyFilePath)) {
      const data = await fs.promises.readFile(historyFilePath, "utf-8");
      history = JSON.parse(data);
    } else {
      await fs.promises.writeFile(historyFilePath, JSON.stringify(history));
    }
    const existingWord = history.find((item) => item.word === word);
    if (existingWord) {
      existingWord.time = new Date().toLocaleString();
    } else {
      history.push({
        word,
        time: new Date().toLocaleString(),
      });
    }
    await fs.promises.writeFile(historyFilePath, JSON.stringify(history));
  } catch (e) {
    console.log(e);
  }
}

/**
 * Get the search history from the file.
 * @returns {Promise<Object[]>} The search history.
 */
async function getHistory() {
  try {
    if (fs.existsSync(historyFilePath)) {
      let data = await fs.promises.readFile(historyFilePath, "utf-8");
      data = JSON.parse(data);
      data.sort((a, b) => new Date(b.time) - new Date(a.time));
      return data;
    }
  } catch (e) {
    console.log(e);
    return [];
  }
}

/**
 * Clear the search history by deleting the file.
 * @returns {Promise<Object[]>} An empty array.
 */
async function clearHistory() {
  try {
    await fs.promises.unlink(historyFilePath);
    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = { saveWord, getHistory, clearHistory };
