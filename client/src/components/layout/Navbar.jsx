import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#2b2b2b',
    color: '#f5c518', // gold text like IMDb
    boxShadow: '0 2px 10px rgba(245, 197, 24, 0.3)', }}>
      <Toolbar>
        {/* Logo */}
        <MovieIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 700,
          }}
        >
          MovieTracker
        </Typography>

        {/* Navigation Links (only if logged in) */}
        {isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              component={Link}
              to="/add-movie"
            >
              Add Movie
            </Button>

            {/* User Menu */}
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user?.username}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}

        {/* Login/Register (only if not logged in) */}
        {!isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: 'secondary.main' }}
              component={Link}
              to="/register"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;