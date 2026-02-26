// Weather service: external API calls and analytics logic.

const axios = require('axios');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const SearchHistory = require('../models/SearchHistory');

const getWeather = async (city) => {
  if (!process.env.WEATHER_API_KEY) {
    throw new Error('WEATHER_API_KEY is not defined in environment variables');
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data || {};
    const main = data.main || {};

    const temperature = main.temp;
    const humidity = main.humidity;

    if (typeof temperature !== 'number' || typeof humidity !== 'number') {
      throw new AppError('Unexpected weather data format', 502, 'EXTERNAL_API_ERROR');
    }

    return {
      city: data.name || city,
      temperature,
      humidity,
    };
  } catch (error) {
    if (error.response) {
      // OpenWeather returns 404 for unknown cities
      if (error.response.status === 404) {
        throw new AppError('City not found', 404, 'CITY_NOT_FOUND');
      }

      throw new AppError(
        'Failed to fetch weather data',
        502,
        'EXTERNAL_API_ERROR',
        null,
        error.response.data && error.response.data.message ? error.response.data.message : undefined
      );
    }

    throw new AppError('Weather service unavailable', 502, 'EXTERNAL_API_ERROR');
  }
};

const getWeatherAnalytics = async ({ userId }) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [result] = await SearchHistory.aggregate([
    { $match: { userId: userObjectId } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        byCity: [
          { $group: { _id: '$city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ],
        avgTemp: [
          {
            $group: {
              _id: null,
              avg: { $avg: '$temperature' },
            },
          },
        ],
        recent: [
          { $sort: { searchedAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              city: 1,
              temperature: 1,
              humidity: 1,
              searchedAt: 1,
            },
          },
        ],
      },
    },
  ]);

  const totalSearches = result && result.total.length > 0 ? result.total[0].count : 0;
  const mostSearchedCity =
    result && result.byCity.length > 0 ? result.byCity[0]._id : null;
  const averageTemperature =
    result && result.avgTemp.length > 0 ? result.avgTemp[0].avg : null;
  const recentSearches = result ? result.recent : [];

  return {
    totalSearches,
    mostSearchedCity,
    recentSearches,
    averageTemperature,
  };
};

module.exports = {
  getWeather,
  getWeatherAnalytics,
};

