import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Email, Person, CalendarToday } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: 32,
              mr: 3,
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Movie Enthusiast
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* User Info */}
        <List>
          <ListItem>
            <Person sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Username"
              secondary={user?.username}
            />
          </ListItem>
          <ListItem>
            <Email sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Email"
              secondary={user?.email}
            />
          </ListItem>
          <ListItem>
            <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Member Since"
              secondary={new Date().toLocaleDateString()}
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Profile;