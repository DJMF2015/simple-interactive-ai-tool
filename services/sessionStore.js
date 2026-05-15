const fs = require('fs');
const path = require('path');
const SessionError = require('../errors/SessionError');
const errors = require('../utils/errorHandler');

const SESSION_FILE = path.join(__dirname, '../data/session.json');

function saveSession(messages, model, summary) {
  try {
    const sessionData = {
      messages,
      model,
      summary,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));
  } catch (err) {
    throw new SessionError('Failed to save session', { details: err.message });
  }
}

function loadSession() {
  if (!fs.existsSync(SESSION_FILE)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(SESSION_FILE);
    return JSON.parse(raw);
  } catch (err) {
    const sessionError = new SessionError('Failed to load session', {
      details: err.message,
      filePath: SESSION_FILE,
    });
    errors.handleError(err, 'Error occured during file loading');
    return null;
  }
}

function clearSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
  }
}

module.exports = { saveSession, loadSession, clearSession };
