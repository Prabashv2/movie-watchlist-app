const db = require('../config/db');

// ============================================
// GET ALL MOVIES FOR LOGGED-IN USER
// ============================================
exports.getMovies = async (req, res) => {
  try {
    // req.user.id comes from authMiddleware
    const userId = req.user.id;

    // Get all movies for this user, newest first
    const [movies] = await db.query(
      'SELECT * FROM movies WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      count: movies.length,
      movies
    });

  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ 
      message: 'Error fetching movies', 
      error: error.message 
    });
  }
};

// ============================================
// GET SINGLE MOVIE BY ID
// ============================================
exports.getMovie = async (req, res) => {
  try {
    const { id } = req.params;        // Get ID from URL
    const userId = req.user.id;       // Get user ID from token

    // Get movie only if it belongs to this user
    const [movies] = await db.query(
      'SELECT * FROM movies WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // Check if movie exists
    if (movies.length === 0) {
      return res.status(404).json({ 
        message: 'Movie not found or you do not have access' 
      });
    }

    res.json({
      success: true,
      movie: movies[0]
    });

  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ 
      message: 'Error fetching movie', 
      error: error.message 
    });
  }
};

// ============================================
// ADD NEW MOVIE
// ============================================
exports.addMovie = async (req, res) => {
  try {
    const { 
      title, 
      genre, 
      year, 
      poster_url, 
      description, 
      status, 
      rating, 
      notes 
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Insert movie
    const [result] = await db.query(
      `INSERT INTO movies 
       (user_id, title, genre, year, poster_url, description, status, rating, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        title, 
        genre || null, 
        year || null, 
        poster_url || null, 
        description || null, 
        status || 'to_watch', 
        rating || null, 
        notes || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      movieId: result.insertId
    });

  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({ 
      message: 'Error adding movie', 
      error: error.message 
    });
  }
};

// ============================================
// UPDATE EXISTING MOVIE
// ============================================
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { 
      title, 
      genre, 
      year, 
      poster_url, 
      description, 
      status, 
      rating, 
      notes 
    } = req.body;

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Update movie (only if belongs to user)
    const [result] = await db.query(
      `UPDATE movies 
       SET title = ?, genre = ?, year = ?, poster_url = ?, 
           description = ?, status = ?, rating = ?, notes = ?
       WHERE id = ? AND user_id = ?`,
      [
        title, 
        genre, 
        year, 
        poster_url, 
        description, 
        status, 
        rating, 
        notes, 
        id, 
        userId
      ]
    );

    // Check if movie was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Movie not found or you do not have access' 
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully'
    });

  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ 
      message: 'Error updating movie', 
      error: error.message 
    });
  }
};

// ============================================
// DELETE MOVIE
// ============================================
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Delete movie (only if belongs to user)
    const [result] = await db.query(
      'DELETE FROM movies WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // Check if movie was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Movie not found or you do not have access' 
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });

  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ 
      message: 'Error deleting movie', 
      error: error.message 
    });
  }
};

// ============================================
// GET DASHBOARD STATISTICS
// ============================================
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total movies
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM movies WHERE user_id = ?',
      [userId]
    );

    // Watched movies
    const [watchedResult] = await db.query(
      'SELECT COUNT(*) as watched FROM movies WHERE user_id = ? AND status = "watched"',
      [userId]
    );

    // To watch movies
    const [toWatchResult] = await db.query(
      'SELECT COUNT(*) as to_watch FROM movies WHERE user_id = ? AND status = "to_watch"',
      [userId]
    );

    // Genre breakdown
    const [genreStats] = await db.query(
      `SELECT genre, COUNT(*) as count 
       FROM movies 
       WHERE user_id = ? AND genre IS NOT NULL 
       GROUP BY genre 
       ORDER BY count DESC`,
      [userId]
    );

    // Average rating
    const [avgRating] = await db.query(
      'SELECT AVG(rating) as average FROM movies WHERE user_id = ? AND rating IS NOT NULL',
      [userId]
    );

    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        watched: watchedResult[0].watched,
        toWatch: toWatchResult[0].to_watch,
        genres: genreStats,
        averageRating: avgRating[0].average ? parseFloat(avgRating[0].average).toFixed(1) : null
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
};

// ============================================
// SEARCH MOVIES
// ============================================
exports.searchMovies = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query, genre, status } = req.query;

    let sql = 'SELECT * FROM movies WHERE user_id = ?';
    let params = [userId];

    // Add search by title
    if (query) {
      sql += ' AND title LIKE ?';
      params.push(`%${query}%`);
    }

    // Add filter by genre
    if (genre) {
      sql += ' AND genre = ?';
      params.push(genre);
    }

    // Add filter by status
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const [movies] = await db.query(sql, params);

    res.json({
      success: true,
      count: movies.length,
      movies
    });

  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ 
      message: 'Error searching movies', 
      error: error.message 
    });
  }
};