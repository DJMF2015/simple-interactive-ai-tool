const { loadSession } = require('./sessionStore');
const ValidationError = require('../errors/ValidationError');

let summary = '';
let messages = [];
let currentFile = null;
let fileName = null;

const MAX_MESSAGES = 8;
const KEEP_RECENT = 4;

if (!Array.isArray(messages)) {
  throw new ValidationError('Messages must be an array');
}

function initialiseSession() {
  const session = loadSession();

  if (session) {
    messages.splice(0, messages.length, ...(session.messages || []));
    summary = session.summary || '';
    currentFile = session.currentFile || null;
    fileName = session.fileName || null;
    console.log('Session loaded with', messages.length, 'messages');
  } else {
    console.log('No previous session found, starting fresh.');
  }
}

function addMessage(role, content) {
  if (!['user', 'assistant', 'system'].includes(role)) {
    throw new ValidationError('Invalid message role', { role });
  }
  messages.push({ role, content });
}

function getRecentMessages() {
  return messages.slice(-KEEP_RECENT);
}

function getMessages() {
  return messages;
}

function shouldSummarise() {
  return messages.length > MAX_MESSAGES;
}
function replaceWithSummary(newSummary) {
  return (summary = newSummary);
}

function getSummary() {
  return summary;
}

function setFile(content, name) {
  currentFile = content;
  fileName = name;
}

function getFile() {
  return { currentFile, fileName };
}

function clearMemory() {
  messages = [];
  summary = '';
  currentFile = null;
  fileName = null;
}

module.exports = {
  initialiseSession,
  addMessage,
  getRecentMessages,
  getMessages,
  shouldSummarise,
  replaceWithSummary,
  getSummary,
  setFile,
  getFile,
  clearMemory,
};
