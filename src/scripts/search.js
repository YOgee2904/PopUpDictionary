const fs = require("fs");
const path = require("path");
const levenshtein = require('js-levenshtein');

const dictionaryFilePath = path.join(__dirname, "../data/words_dictionary.json");

/**
 * Search for words in the dictionary that are similar to the search term.
 * @param {string} searchTerm - The search term.
 * @returns {string[]} The list of similar words.
 */
function searchWords(searchTerm) {
  const data = fs.readFileSync(dictionaryFilePath);
  const dictionary = JSON.parse(data);
  const results = Object.keys(dictionary)
    .map(word => ({ word, distance: levenshtein(searchTerm, word) }))
    .filter(({ distance }) => distance <= Math.min(3, searchTerm.length / 2))
    .sort((a, b) => a.distance - b.distance)
    .map(({ word }) => word);
  return results.slice(0, 10);
}

module.exports = searchWords;