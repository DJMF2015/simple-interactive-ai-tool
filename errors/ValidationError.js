const AppError = require('./AppError');

class ValidationError extends Error {
  constructor(message = 'Validation failed', data = {}) {
    super(message, 400, 'VALIDATION_ERROR', data);
  }
}

module.exports = ValidationError;
