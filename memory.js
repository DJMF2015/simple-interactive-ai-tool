const { loadSession } = require('./sessionStore');

let summary = '';
let messages = [];
let currentFile = null;
let fileName = null;

const MAX_MESSAGES = 8;
const KEEP_RECENT = 4;

// this function is not working as intended, it should load the session data into memory variables, but it seems to be loading empty values. Need to investigate why the session data is not being read correctly from the file or why it's not populating the memory variables as expected.
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

// function clearMessagesOnly() {
//   messages.splice(0, messages.length);
// }

function addMessage(role, content) {
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
  // clearMessagesOnly,
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
