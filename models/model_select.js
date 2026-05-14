const chalk = require('chalk');
const { rl } = require('../cli/cli_setup');
const { MODELS } = require('./models');
const { setModel } = require('../utils/llmConfig');
let CURRENT_MODEL = MODELS[1];

// ---------------- MODEL SELECTION ----------------
function showModels() {
  console.log(chalk.magenta('\nAvailable Models:\n'));

  Object.entries(MODELS).forEach(([key, model]) => {
    console.log(
      chalk.cyan(`${key}. ${model.name}`) + chalk.redBright(` - ${model.description}`),
    );
  });

  console.log('');
}

function selectModel(choice) {
  const selected = MODELS[choice];
  if (!selected) {
    console.log(chalk.red('❌ Invalid model.'));
  }
  setModel(selected);
  console.log(chalk.green(`\n✅ Switched to ${selected.name}\n`));
  console.log(
    chalk.yellow(
      `Model details:\nName: ${selected.name}\nDescription: ${selected.description}\n
    `,
    ),
  );
}

//------------------ STARTUP MODEL SELECTION -------------------------------->
async function chooseStartupModel() {
  return new Promise((resolve) => {
    showModels();

    rl.question(chalk.yellow('Choose model number (default 1): '), (answer) => {
      if (MODELS[answer]) {
        CURRENT_MODEL = MODELS[answer];
      }

      console.log(chalk.green(`\nUsing ${CURRENT_MODEL.name}\n`));
      resolve();
    });
  });
}

module.exports = { chooseStartupModel, showModels, selectModel };
