import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import {
  Movie,
  Star,
  Search,
  Timeline,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Movie sx={{ fontSize: 50 }} />,
      title: 'Track Movies',
      description: 'Keep a list of movies you want to watch and have watched',
    },
    {
      icon: <Star sx={{ fontSize: 50 }} />,
      title: 'Rate & Review',
      description: 'Rate movies out of 5 stars and add personal notes',
    },
    {
      icon: <Search sx={{ fontSize: 50 }} />,
      title: 'Search & Filter',
      description: 'Easily find movies by title, genre, or watch status',
    },
    {
      icon: <Timeline sx={{ fontSize: 50 }} />,
      title: 'Statistics',
      description: 'View your watching habits and favorite genres',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', pt: 8, pb: 10}}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ mb: 2, color: 'white' }}
          >
            Track Your Movie Journey
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: 'white', opacity: 0.9 }}>
            Your personal movie watchlist and rating system
          </Typography>

          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ bgcolor: 'secondary.main', px: 4 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ color: 'white', borderColor: 'white', px: 4 }}
              >
                Login
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ bgcolor: 'secondary.main', px: 4 }}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>

        {/* Features */}
        {/* Features Section */}
<Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
  {features.map((feature, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center',
          height: '100%',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: 'white',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 12px 25px rgba(0,0,0,0.4)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              borderRadius: '50%',
              p: 2,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
            }}
          >
            <Box sx={{ color: 'white', fontSize: 45 }}>{feature.icon}</Box>
          </Box>
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#facc15' }}
        >
          {feature.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          {feature.description}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

      </Container>
    </Box>
  );
};

export default Home;