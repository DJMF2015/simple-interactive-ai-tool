const AppError = require('./AppError');

class FileError extends AppError {
  constructor(message = 'Failed to read file', data = {}) {
    super(message, 400, 'FILE_ERROR', data);
  }
}

module.exports = FileError;
