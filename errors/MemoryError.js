const AppError = require('../utils/errorHandler');

class MemoryError extends Error {
  constructor(message = 'Memory operaton failed', data = {}) {
    super(message, 500, 'MEMORY_ERROR', data);
  }
}

module.exports = MemoryError;
