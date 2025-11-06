import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Rating,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import { addMovie } from '../../services/api';

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
  'Romance', 'Thriller', 'Animation', 'Documentary',
  'Fantasy', 'Mystery', 'Adventure', 'Crime', 'Biography', 'War'
];

const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    year: '',
    poster_url: '',
    description: '',
    status: 'to_watch',
    rating: 0,
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      await addMovie(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Add sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Add New Movie
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Movie Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Genre */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  name="genre"
                  value={formData.genre}
                  label="Genre"
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {GENRES.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }}
              />
            </Grid>

            {/* Poster URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Poster URL (optional)"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleChange}
                helperText="Direct link to movie poster image"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="to_watch">To Watch</MenuItem>
                  <MenuItem value="watched">Watched</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Rating */}
            <Grid item xs={12} sm={6}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                size="large"
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Personal Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Your thoughts, reviews, or reminders..."
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<Add />}
              >
                {loading ? 'Adding Movie...' : 'Add Movie'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddMovie;