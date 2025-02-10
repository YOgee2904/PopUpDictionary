const FetchDictionaryAPI = require("./fetch");
const { getHistory, saveWord } = require("./history");
const { showPopup } = require("./showPopup");

const fetchDictionaryAPI = new FetchDictionaryAPI();

/**
 * Initialize the application by fetching the word data and showing the popup.
 */
async function initialize() {
  let word = process.argv[2] || await getHistory().then(history => history && history.length > 0 ? history[0].word : "hello").catch(error => {
    console.error("Error fetching history:", error);
    return "hello";
  });
  await saveWord(word);
  if (word) {
    const data = await fetchDictionaryAPI.fetchData(word).catch(error => {
      console.error("Error fetching data:", error);
      return null;
    });
    if (data) {
      showPopup(data);
    }
  }
}

module.exports = { initialize };
