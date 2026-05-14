const AppError = require('../utils/errorHandler');

class ApiError extends AppError {
  constructor(message = 'API request failed', data = {}) {
    super(message, 500, 'API_ERROR', data);
  }
}

module.exports = ApiError;
