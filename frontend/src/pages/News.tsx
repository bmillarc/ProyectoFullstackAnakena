import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Search, CalendarToday, Person } from '@mui/icons-material';
import { type NewsItem } from '../services/api';
import { useNewsStore } from '../store/newsStore';
import NewsDetailDialog from '../components/NewsDetail';

const ITEMS_PER_PAGE = 9;

export default function News() {
  const { news, loading, error, loadNews } = useNewsStore();
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Cargar noticias
  useEffect(() => { loadNews(); }, [loadNews]);
  useEffect(() => { setFilteredNews(news); }, [news]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...news];

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const summary = (item.summary || '').toLowerCase();
        const author = (item.author || '').toLowerCase();
        return (
          title.includes(query) ||
          summary.includes(query) ||
          author.includes(query)
        );
      });
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    setFilteredNews(result);
    setPage(1); // Reset a primera página
  }, [searchQuery, categoryFilter, news]);

  // Obtener categorías únicas
  const categories: string[] = ['all', ...Array.from(new Set(news.map((n: NewsItem) => n.category || '')))].filter(Boolean);

  // Paginación
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setDetailOpen(true);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.light',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Noticias
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Mantente al día con las últimas novedades de Anakena DCC
          </Typography>
        </Container>
      </Box>

      {/* Filters Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 3 }}>
        <Container>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '6fr 4fr 2fr',
              },
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Buscador */}
            <Box>
              <TextField
                fullWidth
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: 'white' }}
              />
            </Box>

            {/* Select de categoría */}
            <Box>
              <FormControl fullWidth sx={{ bgcolor: 'white' }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Categoría"
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === 'all' ? 'Todas las categorías' : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Contador de noticias */}
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" color="text.secondary">
                {filteredNews.length}{' '}
                {filteredNews.length === 1 ? 'noticia' : 'noticias'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container sx={{ py: 6 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            {error} (Mostrando datos de ejemplo)
          </Alert>
        )}

        {loading ? (
          <Box textAlign="center" py={8}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
              Cargando noticias...
            </Typography>
          </Box>
        ) : filteredNews.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No se encontraron noticias
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Box>
        ) : (
          <>
            {/* Featured News */}
            {page === 1 && news.filter((n: NewsItem) => n.featured).length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                  Noticias Destacadas
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(2, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {news
                    .filter((n: NewsItem) => n.featured)
                    .slice(0, 2)
                    .map((item: NewsItem) => (
                      <Card
                        key={item.id}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => handleNewsClick(item)}
                      >
                        <CardMedia
                          component="img"
                          height="250"
                          image={item.image}
                          alt={item.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ mb: 2 }}>
                            <Chip
                              label={item.category}
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                            label="Destacada"
                            size="small"
                            sx={{
                                bgcolor: '#F6C500',
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                            />
                          </Box>
                          <Typography
                            variant="h5"
                            component="h3"
                            gutterBottom
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                          >
                            {item.summary}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              mt: 2,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday
                                fontSize="small"
                                color="action"
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  item.date
                                ).toLocaleDateString('es-CL', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Typography>
                            </Box>
                            {item.author && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                <Person
                                  fontSize="small"
                                  color="action"
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {item.author}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </Box>
            )}

            {/* All News Grid */}
            <Typography variant="h4" gutterBottom sx={{ mb: 3, mt: 6 }}>
              Todas las Noticias
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {paginatedNews.map((item: NewsItem) => (
                <Card
                  key={item.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleNewsClick(item)}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip
                      label={item.category}
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.summary}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <CalendarToday
                        fontSize="small"
                        color="action"
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(item.date).toLocaleDateString(
                          'es-CL'
                        )}
                      </Typography>
                    </Box>
                    <Button size="small" sx={{ ml: 'auto' }}>
                      Leer más
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 6,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* News Detail Dialog */}
      <NewsDetailDialog
        news={selectedNews}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </Box>
  );
}
