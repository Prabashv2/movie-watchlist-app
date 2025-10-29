const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow frontend to connect
app.use(cors());

// Body parser - Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (optional, helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Movie Watchlist API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login)',
      movies: '/api/movies (CRUD operations)'
    }
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Movie routes (protected)
app.use('/api/movies', movieRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    🚀 Server is running!
    📡 Port: ${PORT}
    🌍 URL: http://localhost:${PORT}
    📝 Test: http://localhost:${PORT}/api/auth/register
  `);
});