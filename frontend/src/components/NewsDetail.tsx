import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  Divider,
  Button
} from '@mui/material';
import { Close, CalendarToday, Person, Share } from '@mui/icons-material';
import type { NewsItem } from '../services/api';

interface NewsDetailDialogProps {
  news: NewsItem | null;
  open: boolean;
  onClose: () => void;
}

export default function NewsDetailDialog({ news, open, onClose }: NewsDetailDialogProps) {
  if (!news) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Image */}
        <Box
          component="img"
          src={news.image}
          alt={news.title}
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            mt: 2
          }}
        />

        {/* Content */}
        <Box sx={{ p: 3 }}>
        {/* Category and Featured Badges */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={news.category} color="primary" />
            {news.featured && (
            <Chip
                label="Destacada"
                sx={{
                bgcolor: '#F6C500',
                color: 'black',
                fontWeight: 'bold'
                }}
            />
            )}
        </Box>

          {/* Title */}
          <Typography variant="h4" component="h2" gutterBottom>
            {news.title}
          </Typography>

          {/* Meta Info */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {new Date(news.date).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
            {news.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {news.author}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Summary */}
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ fontWeight: 500, fontStyle: 'italic' }}
          >
            {news.summary}
          </Typography>

          {/* Content */}
          <Typography
            variant="body1"
            paragraph
            sx={{
              lineHeight: 1.8,
              fontSize: '1.1rem',
              whiteSpace: 'pre-line'
            }}
          >
            {news.content}
          </Typography>

          {/* Share Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShare}
            >
              Compartir
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}