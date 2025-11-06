import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Rating,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  WatchLater,
} from '@mui/icons-material';

const MovieCard = ({ movie, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const defaultPoster =
    'https://via.placeholder.com/300x450/667eea/ffffff?text=No+Poster';

  return (
    <Card
      sx={{
        width: 300, // 🔹 Fixed width for consistent card size
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 3,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 6,
        },
      }}
      className="animate-fadeIn"
    >
      {/* Movie Poster */}
      <CardMedia
        component="img"
        height="180" // 🔹 Reduced image height
        image={movie.poster_url || defaultPoster}
        alt={movie.title}
        sx={{
          objectFit: 'cover',
          cursor: 'pointer',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        onClick={() => navigate(`/movie/${movie.id}`)}
      />

      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        {/* Title */}
        <Typography
          variant="subtitle1"
          component="div"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.title}
        </Typography>

        {/* Genre & Year */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          {movie.genre && (
            <Chip
              label={movie.genre}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {movie.year && (
            <Chip
              label={movie.year}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>

        {/* Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          {movie.status === 'watched' ? (
            <>
              <CheckCircle
                sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }}
              />
              <Typography variant="body2" color="success.main" sx={{ fontSize: '0.8rem' }}>
                Watched
              </Typography>
            </>
          ) : (
            <>
              <WatchLater
                sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }}
              />
              <Typography variant="body2" color="warning.main" sx={{ fontSize: '0.8rem' }}>
                To Watch
              </Typography>
            </>
          )}
        </Box>

        {/* Rating */}
        {movie.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Rating value={movie.rating} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1, fontSize: '0.8rem' }}>
              {movie.rating}/5
            </Typography>
          </Box>
        )}

        {/* Notes Preview */}
        {movie.notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {movie.notes}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 1.5, pb: 1.5 }}>
        <Tooltip title="View Details">
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box>
          <Tooltip title="Edit">
            <IconButton color="info" size="small" onClick={() => onEdit(movie)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={() => onDelete(movie.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
