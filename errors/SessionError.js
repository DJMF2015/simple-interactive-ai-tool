const AppError = require('./AppError');

class SessionError extends AppError {
  constructor(message = 'Session opertion failed', data = {}) {
    super(message, 500, 'SESSION_ERROR', data);
  }
}

module.exports = SessionError;
