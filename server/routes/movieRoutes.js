const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMovies,
  getMovie,
  addMovie,
  updateMovie,
  deleteMovie,
  getStats,
  searchMovies
} = require('../controllers/movieController');

// Apply auth middleware to ALL routes in this file
router.use(authMiddleware);

// GET /api/movies - Get all movies
router.get('/', getMovies);

// GET /api/movies/stats - Get statistics
router.get('/stats', getStats);

// GET /api/movies/search - Search movies
router.get('/search', searchMovies);

// GET /api/movies/:id - Get single movie
router.get('/:id', getMovie);

// POST /api/movies - Add new movie
router.post('/', addMovie);

// PUT /api/movies/:id - Update movie
router.put('/:id', updateMovie);

// DELETE /api/movies/:id - Delete movie
router.delete('/:id', deleteMovie);

module.exports = router;