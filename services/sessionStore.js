const fs = require('fs');
const path = require('path');
const { AppError } = require('../utils/errorHandler');
const SessionError = require('../errors/SessionError');

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
    console.log('Error loading session:', err);
    throw new SessionError('Failed to load session', { details: err.message });
    return null;
  }
}

function clearSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
  }
}

module.exports = { saveSession, loadSession, clearSession };
