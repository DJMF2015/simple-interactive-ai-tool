const mammoth = require('mammoth');
const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');
const memory = require('../services/memory');
const pathModule = require('path');
const AppError = require('../utils/errorHandler');
const FileError = require('../errors/FileError');
// ---------------- SAFETY CHECK ----------------
function checkApiKey() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new AppError('❌ Missing OPENROUTER_API_KEY in .env file', 400, {});
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
    throw new FileError(`File not found: ${resolvedPath}`);
  }
  loadPath = loadPath.trim();
  loadPath = loadPath.replace(/^["']|["']$/g, '');

  const ext = resolvedPath.split('.').pop().toLowerCase();

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
    throw new FileError(`Failed to read file ${loadPath}`, { details: err.message });
  }
}

module.exports = { loadFile, rl, args, checkApiKey };
