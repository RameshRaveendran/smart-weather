const { sendError } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  return sendError(res, message, code, statusCode, err.errors || null, err.details || null);
};

module.exports = {
  notFound,
  errorHandler,
};

