const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return next(
        new AppError('Validation error', 400, 'VALIDATION_ERROR', [
          // Field-level validation details can be added when implementing.
        ])
      );
    }

    const result = await registerUser({ name, email, password });

    return sendSuccess(res, 'User registered successfully', result, 201);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(
        new AppError('Validation error', 400, 'VALIDATION_ERROR', [
          // Field-level validation details can be added when implementing.
        ])
      );
    }

    const result = await loginUser({ email, password });

    return sendSuccess(res, 'Login successful', result, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
};

