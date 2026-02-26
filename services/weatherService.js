// Weather service: external API calls and analytics logic.

const axios = require('axios');
const AppError = require('../utils/AppError');

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

// Placeholder for future analytics implementation, kept for architecture consistency.
const getWeatherAnalytics = async ({ userId, from, to, limit }) => {
  return {
    totalSearches: 0,
    topCities: [],
    averageTemperature: null,
    averageHumidity: null,
    searches: [],
  };
};

module.exports = {
  getWeather,
  getWeatherAnalytics,
};

