// Weather service: external API calls and analytics logic will be implemented here.

const fetchWeatherForCity = async ({ userId, city }) => {
  // TODO: Call external weather API, normalize response, store SearchHistory.
  return {
    city,
    temperature: null,
    humidity: null,
    description: null,
    source: null,
    searchedAt: new Date(),
  };
};

const getWeatherAnalytics = async ({ userId, from, to, limit }) => {
  // TODO: Aggregate search history for analytics.
  return {
    totalSearches: 0,
    topCities: [],
    averageTemperature: null,
    averageHumidity: null,
    searches: [],
  };
};

module.exports = {
  fetchWeatherForCity,
  getWeatherAnalytics,
};

