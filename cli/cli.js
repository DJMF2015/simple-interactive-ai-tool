require('dotenv').config();

const chalk = require('chalk');
const { formatResponse } = require('../utils/clean');
const { loadFile, rl } = require('./cli_setup');
const safeExecute = require('../utils/safeExecute');
const { askLLM } = require('../services/llm');
const { loadSession, clearSession } = require('../services/sessionStore');
const { showModels, selectModel } = require('../models/model_select');
const memory = require('../services/memory');

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function normalPromptMode() {
  const prompt = await ask(chalk.yellow('Enter your question or command: '));
  console.log(chalk.green('\n✅ Sending to LLM...Thinking...\n'));
  if (prompt.toLowerCase() === 'back') {
    return;
  }

  const response = await askLLM(prompt);
  console.log(chalk.green('\n🧠 Response:\n'));
  console.log(formatResponse(response) + '\n');
}

async function fileMode() {
  const path = await ask(chalk.yellow('\nEnter file path: '));
  const fileContent = await loadFile(path);

  if (!fileContent) {
    console.log(chalk.red('❌ Could not read file'));
    return;
  }
  memory.setFile(fileContent, path);

  console.log(chalk.green('\n✅ File loaded.\n'));
}

(async function mainMenu() {
  const session = loadSession();

  if (session && session.messages) {
    console.log(chalk.yellow('Previous session found, loading messages and summary...'));

    const answer = await new Promise((resolve) =>
      rl.question(chalk.yellow('Load previous session? (y/n): '), resolve),
    );

    if (answer.toLowerCase() === 'y') {
      memory.initialiseSession();
    } else {
      console.log(chalk.yellow('Starting new session...'));
      clearSession();
    }
  }

  while (true) {
    console.log(chalk.cyan('\n🤖 AI CLI TOOL\n'));
    console.log('1. Ask a normal question');
    console.log('2. Analyse a file');
    console.log('3. Change model');
    console.log('4. Clear memory');
    console.log('5. Exit');

    const choice = await ask(chalk.yellow('\nChoose option: '));

    switch (choice) {
      case '1':
        await safeExecute(async () => {
          await normalPromptMode();
        }, 'Prompt Mode');
        break;
      case '2':
        await fileMode();
        break;
      case '3':
        showModels();
        const model = await ask(chalk.yellow('Choose model number: '));
        selectModel(Number(model));
        break;
      case '4':
        memory.clearMemory();
        clearSession();
        console.log(chalk.green('✅ Memory cleared\n'));
        break;
      case '5':
        rl.close();
        console.log(chalk.green('\nGoodbye!\n'));
        process.exit(0);
      default:
        console.log(chalk.red('Invalid choice'));
    }
  }
})();
