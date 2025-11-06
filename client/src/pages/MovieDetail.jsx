import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  CheckCircle,
  WatchLater,
  CalendarToday,
  Category,
} from '@mui/icons-material';
import { getMovie, deleteMovie } from '../services/api';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await getMovie(id);
      setMovie(response.data.movie);
    } catch (err) {
      console.error('Failed to fetch movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete movie');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5">Movie not found</Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const defaultPoster = 'https://via.placeholder.com/400x600/667eea/ffffff?text=No+Poster';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <Grid container>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={movie.poster_url || defaultPoster}
              alt={movie.title}
              sx={{
                width: '100%',
                height: { xs: 400, md: '100%' },
                objectFit: 'cover',
              }}
            />
          </Grid>

          {/* Movie Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 4 }}>
              {/* Back Button */}
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
              >
                Back
              </Button>

              {/* Title */}
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {movie.title}
              </Typography>

              {/* Genre, Year, Status */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {movie.genre && (
                  <Chip
                    icon={<Category />}
                    label={movie.genre}
                    color="primary"
                  />
                )}
                {movie.year && (
                  <Chip
                    icon={<CalendarToday />}
                    label={movie.year}
                    variant="outlined"
                  />
                )}
                {movie.status === 'watched' ? (
                  <Chip
                    icon={<CheckCircle />}
                    label="Watched"
                    color="success"
                  />
                ) : (
                  <Chip
                    icon={<WatchLater />}
                    label="To Watch"
                    color="warning"
                  />
                )}
              </Box>

              {/* Rating */}
              {movie.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Rating value={movie.rating} readOnly size="large" />
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {movie.rating}/5
                  </Typography>
                </Box>
              )}

              <Divider sx={{ mb: 3 }} />

              {/* Description */}
              {movie.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {movie.description}
                  </Typography>
                </Box>
              )}

              {/* Personal Notes */}
              {movie.notes && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    My Notes
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Typography variant="body1">{movie.notes}</Typography>
                  </Paper>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/edit-movie/${movie.id}`, { state: { movie } })}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>

              {/* Metadata */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Added: {new Date(movie.created_at).toLocaleDateString()}
                </Typography>
                {movie.updated_at !== movie.created_at && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    Updated: {new Date(movie.updated_at).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovieDetail;