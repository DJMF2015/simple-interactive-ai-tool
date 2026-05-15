const AppError = require('./AppError');

class MemoryError extends AppError {
  constructor(message = 'Memory operation failed', data = {}) {
    super(message, 500, 'MEMORY_ERROR', data);
  }
}

module.exports = MemoryError;
