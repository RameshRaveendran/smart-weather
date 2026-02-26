const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message, code = 'INTERNAL_ERROR', statusCode = 500, errors = null, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: {
      code,
      ...(errors ? { errors } : {}),
      ...(details ? { details } : {}),
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
};

