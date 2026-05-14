class AppError extends Error {
  constructor(
    message = 'Something went wrong',
    statusCode = 500,
    code = 'APP_ERROR',
    data = {},
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
