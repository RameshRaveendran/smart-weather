const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getWeather, getAnalytics } = require('../controllers/weatherController');

const router = express.Router();

router.get('/', authMiddleware, getWeather);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;

