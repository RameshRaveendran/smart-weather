const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const { getWeather, getWeatherAnalytics } = require('../services/weatherService');
const SearchHistory = require('../models/SearchHistory');

const getWeatherData = async (req, res, next) => {
  try {
    const { city } = req.query || {};

    if (!city) {
      return next(
        new AppError('Validation error', 400, 'VALIDATION_ERROR', [
          { field: 'city', message: 'City is required' },
        ])
      );
    }

    const weather = await getWeather(city);

    try {
      await SearchHistory.create({
        userId: req.user.id,
        city: weather.city,
        temperature: weather.temperature,
        humidity: weather.humidity,
        searchedAt: new Date(),
      });
    } catch (dbError) {
      return next(new AppError('Database error', 500, 'DB_ERROR', null, dbError.message));
    }

    return sendSuccess(
      res,
      'Weather fetched successfully',
      {
        city: weather.city,
        temperature: weather.temperature,
        humidity: weather.humidity,
      },
      200
    );
  } catch (err) {
    return next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const result = await getWeatherAnalytics({
      userId: req.user.id,
    });

    return sendSuccess(res, 'Analytics fetched successfully', result, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getWeatherData,
  getAnalytics,
};

