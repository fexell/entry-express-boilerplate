
/**
 * @typedef {Object} StringHelper
 * @property {Function} Capitalize - This method is responsible for capitalizing the first letter of a string.
 */
const StringHelper                          = {}

/**
 * Capitalize the first letter of a string, and lowercase the rest
 * 
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
StringHelper.Capitalize                     = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export {
  StringHelper as default,
}
