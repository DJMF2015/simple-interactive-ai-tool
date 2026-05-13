const chalk = require('chalk');
const AppError = require('../errors/AppError');

function handleError(err, context = 'Application') {
  console.log(chalk.red(`\n❌ ${context} Error\n`));
  if (err instanceof AppError) {
    console.log(chalk.red(`Message: ${err.message}`));

    if (Object.keys(err.data).length > 0) {
      console.log(chalk, yellow(`Additional Data: ${JSON.stringify(err.data)}`));
    }
    return;
  }

  if (err.reponse) {
    console.log(chalk.red(`Status: ${err.response.status}`));
    console.log(
      chalk.red(
        `Data: ${JSON.stringify(err.response?.data?.message || 'Unknown API error')}`,
      ),
    );
    return;
  }
}

module.exports = handleError;
