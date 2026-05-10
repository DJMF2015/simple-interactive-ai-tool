const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'session.json');

function saveSession(messages, model, summary) {
  const sessionData = {
    messages,
    model,
    summary,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));
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
    return null;
  }
}

function clearSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
  }
}

module.exports = { saveSession, loadSession, clearSession };
