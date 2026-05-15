const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Validation failed', data = {}) {
    super(message, 400, 'VALIDATION_ERROR', data);
  }
}

module.exports = ValidationError;
