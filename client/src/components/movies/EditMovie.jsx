import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import { updateMovie, getMovie } from '../../services/api';

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
  'Romance', 'Thriller', 'Animation', 'Documentary',
  'Fantasy', 'Mystery', 'Adventure', 'Crime', 'Biography', 'War'
];

const EditMovie = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    // Try to get movie from location state first (from MovieCard)
    if (location.state?.movie) {
      setFormData(location.state.movie);
      setFetchLoading(false);
    } else {
      // Otherwise fetch from API
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await getMovie(id);
      setFormData(response.data.movie);
    } catch (err) {
      setError('Failed to fetch movie details');
    } finally {
      setFetchLoading(false);
    }
  };

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
    setLoading(true);

    try {
      await updateMovie(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update movie');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <Edit sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Edit Movie
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Same form fields as AddMovie */}
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  name="genre"
                  value={formData.genre || ''}
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Poster URL"
                name="poster_url"
                value={formData.poster_url || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

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

            <Grid item xs={12} sm={6}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating || 0}
                onChange={handleRatingChange}
                size="large"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Personal Notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<Edit />}
              >
                {loading ? 'Updating Movie...' : 'Update Movie'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditMovie;