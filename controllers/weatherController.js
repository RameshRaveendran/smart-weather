const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const { fetchWeatherForCity, getWeatherAnalytics } = require('../services/weatherService');

const getWeather = async (req, res, next) => {
  try {
    const { city } = req.query || {};

    if (!city) {
      return next(
        new AppError('Validation error', 400, 'VALIDATION_ERROR', [
          { field: 'city', message: 'City is required' },
        ])
      );
    }

    const result = await fetchWeatherForCity({ userId: req.user.id, city });

    return sendSuccess(res, 'Weather data fetched successfully', result, 200);
  } catch (err) {
    return next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const { from, to, limit } = req.query || {};

    const result = await getWeatherAnalytics({
      userId: req.user.id,
      from,
      to,
      limit: limit ? Number(limit) : undefined,
    });

    return sendSuccess(res, 'Weather analytics fetched successfully', result, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getWeather,
  getAnalytics,
};

