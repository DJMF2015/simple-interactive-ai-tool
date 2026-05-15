const chalk = require('chalk');
const AppError = require('../errors/AppError');

/**
 *
 * @param {error} err
 * @param context
 * @returns error message, code and error status. If API error occurs, returns endpoint the error occured or a 500 server message error
 */
function handleError(err, context = 'Application') {
  console.log(chalk.red(`\n❌ ${context} Error\n`));

  if (err instanceof AppError) {
    console.log(chalk.red(`Message: ${err.message}`));
    console.log(chalk.red(`Code: ${err.code}`));

    if (Object.keys(err.data).length > 0) {
      console.log(chalk.yellow(`Additional Data: ${JSON.stringify(err.data, null)}`));
    }
    return err;
  }

  if (err.response) {
    console.log(chalk.red(`Status: ${err.response.status}`));

    console.log(
      chalk.red(
        `Data: ${JSON.stringify(err.response?.data?.message || 'Unknown API error')}`,
      ),
    );
    return new AppError(
      err?.response?.message || 'API request failed',
      err.response.status,
      'API_ERROR',
      { endpoint: err.config?.url },
    );
  }
  console.log(chalk.red(`Message: ${err.message}`));
  console.log(chalk.red(`Stack: ${err.stack}`));
  return new AppError(err.message, 500, 'UNKNOWN_ERROR');
}

function validateResponse(obj, path, context = 'Application') {
  const value = path.split('.').reduce((acc, key) => {
    return acc?.[key];
  }, obj);

  if (!value) {
    throw new AppError(
      `Missing expected response field: ${path}`,
      500,
      'INVALID_RESPONSE',
      { context },
    );
  }

  return value;
}

module.exports = { handleError, validateResponse };
