import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Search, FilterList, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getMovies, deleteMovie } from '../../services/api';
import MovieCard from './MovieCard';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const navigate = useNavigate();

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Apply filters when movies or filters change
  useEffect(() => {
    applyFilters();
  }, [movies, searchQuery, genreFilter, statusFilter]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getMovies();
      setMovies(response.data.movies);
      setError('');
    } catch (err) {
      setError('Failed to fetch movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter((movie) => movie.genre === genreFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((movie) => movie.status === statusFilter);
    }

    setFilteredMovies(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        setMovies(movies.filter((movie) => movie.id !== id));
      } catch (err) {
        alert('Failed to delete movie');
        console.error(err);
      }
    }
  };

  const handleEdit = (movie) => {
    navigate(`/edit-movie/${movie.id}`, { state: { movie } });
  };

  // Get unique genres from movies
  const genres = [...new Set(movies.map((m) => m.genre).filter(Boolean))];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          My Movies
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/add-movie')}
        >
          Add Movie
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Search */}
        <TextField
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Genre Filter */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            label="Genre"
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="watched">Watched</MenuItem>
            <MenuItem value="to_watch">To Watch</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {movies.length === 0
              ? 'No movies yet. Add your first movie!'
              : 'No movies match your filters'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard
                movie={movie}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MovieList;