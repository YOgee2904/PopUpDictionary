/**
 * Clean the selected text by removing special characters and limiting to the first 4 words.
 * @param {string} text - The text to clean.
 * @returns {string} The cleaned text.
 */
const cleanSelectedText = (text) => {
  // Remove leading and trailing whitespace
  let cleanedText = text.trim();

  // Remove or replace special characters
  cleanedText = cleanedText.replace(/[^a-zA-Z\s'-]/g, "");

  // Handle multiple spaces
  cleanedText = cleanedText.replace(/\s+/g, " ");

  // Split camel case words
  cleanedText = cleanedText.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Limit to the first 4 words
  const words = cleanedText.split(" ");
  cleanedText = words.slice(0, 4).join(" ");

  return cleanedText;
};

module.exports = { cleanSelectedText };