const AppError = require('../utils/errorHandler');

class SessionError extends Error {
  constructor(message = 'Session opertion failed', data = {}) {
    super(message, 500, 'SESSION_ERROR', data);
  }
}

module.exports = SessionError;
