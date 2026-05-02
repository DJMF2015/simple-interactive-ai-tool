require('dotenv').config();

const chalk = require('chalk');
const { formatResponse } = require('./clean');
const { loadFile, rl } = require('./cli_setup');
const { askLLM } = require('./llm');
const { showModels, selectModel } = require('./model_select');
const { MODELS } = require('./models');

async function normalPromptMode() {
  const prompt = await ask(chalk.yellow('Enter your question or command: '));
  if (prompt.toLowerCase() === 'back') {
    return;
  }
  const response = await askLLM(prompt);

  if (response) {
    console.log(chalk.green('\n🧠 AI response:\n'));
    console.log(formatResponse(response));
  }
}

async function fileMode() {
  const path = await ask(chalk.yellow('\nEnter file path: '));
  const fileContent = await loadFile(path);

  if (!fileContent) {
    console.log(chalk.red('❌ Could not read file'));
    return;
  }
  console.log(chalk.green('\n✅ File loaded successfully.\n'));

  while (true) {
    const question = await ask(
      chalk.yellow('Enter your question about the file (or type "exit" to quit): '),
    );

    if (question.toLowerCase() === 'back') {
      return;
    }
    const prompt = `
FILE CONTENT:
-------------------
${fileContent}
-------------------

QUESTION:
${question}
`;
    const response = await askLLM(prompt);

    console.log(chalk.green('\n🧠 Response:\n'));
    console.log(response + '\n');
  }
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function mainMenu() {
  while (true) {
    console.log(chalk.cyan('\n🤖 AI CLI TOOL\n'));
    console.log('1. Ask a normal question');
    console.log('2. Analyse a file');
    console.log('3. Change model');
    console.log('4. Exit');

    const choice = await ask(chalk.yellow('\nChoose option: '));
    if (choice === '1') await normalPromptMode();
    else if (choice === '2') await fileMode();
    else if (choice === '3') {
      showModels();
      const model = await ask('Choose model number: ');
      selectModel(Number(model));
    } else if (choice === '4') {
      rl.close();
      process.exit(0);
    } else {
      console.log(chalk.red('Invalid choice'));
    }
  }
}
mainMenu();
module.exports = { mainMenu };
