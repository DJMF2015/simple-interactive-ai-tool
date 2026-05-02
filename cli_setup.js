const mammoth = require('mammoth');
const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');
// ---------------- SAFETY CHECK ----------------
function checkApiKey() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('❌ Missing OPENROUTER_API_KEY in .env file');
  }
}
// ---------------- CLI SETUP ----------------
const args = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ---------------- FILE LOADER ----------------
async function loadFile(loadPath) {
  const ext = loadPath.split('.').pop().toLowerCase();

  try {
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: loadPath });
      return result.value;
    }
    return fs.readFileSync(loadPath, 'utf-8');
  } catch (err) {
    console.log(chalk.red(' Failed to read file:'), err.message);
    return null;
  }
}

module.exports = { loadFile, rl, args, checkApiKey };
