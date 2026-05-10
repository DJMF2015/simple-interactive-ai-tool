const mammoth = require('mammoth');
const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');
const memory = require('./memory');
const pathModule = require('path');
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
  console.log(chalk.yellow(`\n ${loadPath}\n`));
  const resolvedPath = pathModule.resolve(loadPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(chalk.red('❌ File does not exist'));
  }
  loadPath = loadPath.trim();
  loadPath = loadPath.replace(/^["']|["']$/g, '');

  const ext = loadPath.split('.').pop().toLowerCase();
  // loadPath = ext.replace(/^["']|["']$/g, '');

  try {
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: loadPath });

      return result.value;
    } else {
      const content = fs.readFileSync(loadPath, 'utf8');

      memory.setFile(content, loadPath);
    }
    return fs.readFileSync(loadPath, 'utf-8');
  } catch (err) {
    throw new Error(chalk.red(` Failed to read file: ${err.message}`));
  }
}

module.exports = { loadFile, rl, args, checkApiKey };
