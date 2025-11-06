import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Movie,
  CheckCircle,
  WatchLater,
  Star,
} from '@mui/icons-material';
import { getStats } from '../services/api';
import MovieList from '../components/movies/MovieList';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Box sx={{ color: color, fontSize: 40 }}>{icon}</Box>
      <Box>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Movie />}
            title="Total Movies"
            value={stats?.total || 0}
            color="#0ea5e9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircle />}
            title="Watched"
            value={stats?.watched || 0}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<WatchLater />}
            title="To Watch"
            value={stats?.toWatch || 0}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Star />}
            title="Avg Rating"
            value={stats?.averageRating || 'N/A'}
            color="#8b5cf6"
          />
        </Grid>
      </Grid>

      {/* Genre Breakdown */}
      {stats?.genres && stats.genres.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Movies by Genre
          </Typography>
          <Grid container spacing={2}>
            {stats.genres.map((genre) => (
              <Grid item xs={6} sm={4} md={3} key={genre.genre}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {genre.count}
                  </Typography>
                  <Typography variant="body2">{genre.genre}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Movie List */}
      <MovieList />
    </Container>
  );
};

export default Dashboard;