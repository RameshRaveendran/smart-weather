const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Core middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Weather API is running',
    data: null,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

// Connect to DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });

