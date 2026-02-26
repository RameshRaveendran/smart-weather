const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getWeatherData, getAnalytics } = require('../controllers/weatherController');

const router = express.Router();

router.get('/', authMiddleware, getWeatherData);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;

