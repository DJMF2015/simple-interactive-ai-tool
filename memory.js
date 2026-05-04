let summary = '';
let messages = [];
let currentFile = null;
let fileName = null;

const MAX_MESSAGES = 8;
let KEEP_RECENT = 4;

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
  summary = '';
  messages = [];
  currentFile = null;
  fileName = null;
}

module.exports = {
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
