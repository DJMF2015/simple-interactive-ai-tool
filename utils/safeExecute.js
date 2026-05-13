const handleError = require('./errorHandler');

/**
 * Executes a function safely, handling any errors that may occur.
 * @param {Function} fn - The function to execute.
 * @param {String} context - The context for error handling.
 * @returns {Promise<any>} - The result of the function or null if an error occurs.
 */
async function safeExecute(fn, context = 'Operation') {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return null;
  }
}

module.exports = safeExecute;
