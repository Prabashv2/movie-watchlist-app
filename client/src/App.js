import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';

// Movie Components
import AddMovie from './components/movies/AddMovie';
import EditMovie from './components/movies/EditMovie';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9',
    },
    secondary: {
      main: '#8b5cf6',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <PrivateRoute>
                  <MovieDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-movie"
              element={
                <PrivateRoute>
                  <AddMovie />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-movie/:id"
              element={
                <PrivateRoute>
                  <EditMovie />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;