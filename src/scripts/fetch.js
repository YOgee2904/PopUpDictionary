const axios = require("axios");

class FetchDictionaryAPI {
  /**
   * Fetch the meaning of a word from the dictionary API.
   * @param {string} word - The word to fetch the meaning of.
   * @returns {Promise<Object>} The meaning data.
   */
  async fetchMeaning(word) {
    try {
      let response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      let data = response.data[0];
      return data;
    } catch (error) {
      return { word, error: "Word not found!" };
    }
  }

  /**
   * Fetch the Wikipedia summary of a word.
   * @param {string} word - The word to fetch the summary of.
   * @returns {Promise<Object>} The summary data.
   */
  async fetchWikipediaSummary(word) {
    try {
      let response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${word}`
      );
      let data = response.data;
      return data;
    } catch (error) {
      return { word, error: "Error fetching Wikipedia summary" };
    }
  }

  /**
   * Fetch both the dictionary meaning and Wikipedia summary of a word.
   * @param {string} word - The word to fetch data for.
   * @returns {Promise<Object>} The combined data.
   */
  async fetchData(word) {
    return {
      word: word,
      dictionary: await this.fetchMeaning(word),
      wiki: await this.fetchWikipediaSummary(word),
    };
  }
}

module.exports = FetchDictionaryAPI;
