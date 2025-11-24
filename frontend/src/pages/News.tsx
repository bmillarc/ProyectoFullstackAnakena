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
import apiService, { type NewsItem } from '../services/api';
import { resolveNewsImage } from '../utils/imagenes';
import bannerImg from '../assets/banner.png';
import NewsDetailDialog from '../components/NewsDetail';

const ITEMS_PER_PAGE = 9;

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Cargar noticias
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const newsData = await apiService.getNews();

        // Resolver imágenes
        const newsWithImages = newsData.map((n) => ({
          ...n,
          image: resolveNewsImage(n.image) || bannerImg,
        }));

        // Ordenar por fecha más reciente
        newsWithImages.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setNews(newsWithImages);
        setFilteredNews(newsWithImages);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Error al cargar las noticias desde el servidor');

        // Fallback a datos mock
        const mockNews: NewsItem[] = [
          {
            id: 1,
            title: 'Victoria histórica en el torneo de fútbol',
            summary:
              'El equipo de fútbol masculino de Anakena logró una victoria decisiva 3-1 contra el equipo de Ingeniería.',
            content:
              'En un partido emocionante disputado en la Cancha Sur del Campus, el equipo de fútbol masculino de Anakena DCC demostró su calidad y determinación al vencer 3-1 al equipo de Ingeniería. Los goles fueron anotados por Carlos Rodríguez (2) y Mario Silva (1), consolidando la posición del equipo en el torneo interfacultades.',
            date: '2024-11-20',
            author: 'Comunicaciones Anakena',
            category: 'Fútbol',
            image: bannerImg,
            teamId: 1,
            featured: true,
          },
          {
            id: 2,
            title: 'Nuevas incorporaciones en básquetbol femenino',
            summary:
              'Se suman 4 nuevas jugadoras al plantel de básquetbol femenino para la temporada 2024.',
            content:
              'El equipo de básquetbol femenino de Anakena DCC se refuerza con cuatro nuevas jugadoras de gran calidad. Las incorporaciones traen experiencia de torneos universitarios previos y están listas para aportar al equipo en la próxima temporada.',
            date: '2024-11-18',
            author: 'Staff Técnico',
            category: 'Básquetbol',
            image: bannerImg,
            teamId: 2,
            featured: false,
          },
          {
            id: 3,
            title: 'Torneo interuniversitario de vólibol',
            summary:
              'Anakena participa en el torneo interuniversitario con grandes expectativas.',
            content:
              'El equipo mixto de vólibol de Anakena DCC se prepara para enfrentar a los mejores equipos universitarios del país en el torneo interuniversitario que se realizará durante el próximo mes.',
            date: '2024-11-15',
            author: 'Prensa Anakena',
            category: 'Vólibol',
            image: bannerImg,
            teamId: 3,
            featured: true,
          },
          {
            id: 4,
            title: 'Anakena celebra su aniversario',
            summary:
              'El club deportivo cumple un año más de historia y tradición en el DCC.',
            content:
              'Con una emotiva ceremonia, el club deportivo Anakena DCC celebró un aniversario más, recordando los logros alcanzados y mirando hacia el futuro con optimismo y nuevos desafíos.',
            date: '2024-11-10',
            author: 'Directiva Anakena',
            category: 'Institucional',
            image: bannerImg,
            featured: false,
          },
          {
            id: 5,
            title: 'Resultados destacados en atletismo',
            summary:
              'Los corredores de Anakena obtienen excelentes tiempos en la última competencia.',
            content:
              'Los atletas de Anakena Runners demostraron su preparación al lograr tiempos destacados en la última carrera universitaria de 10K, posicionándose entre los mejores competidores.',
            date: '2024-11-08',
            author: 'Equipo de Atletismo',
            category: 'Atletismo',
            image: bannerImg,
            teamId: 6,
            featured: false,
          },
          {
            id: 6,
            title: 'Inicio de la temporada de handball',
            summary:
              'El equipo de handball masculino comienza su preparación para el torneo regional.',
            content:
              'Con intensos entrenamientos y nuevas estrategias, el equipo de handball masculino de Anakena se prepara para competir en el torneo regional que comenzará el próximo mes.',
            date: '2024-11-05',
            author: 'Coach Handball',
            category: 'Handball',
            image: bannerImg,
            teamId: 4,
            featured: false,
          },
        ];

        setNews(mockNews);
        setFilteredNews(mockNews);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = [...news];

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
      );
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    setFilteredNews(result);
    setPage(1); // Reset a primera página
  }, [searchQuery, categoryFilter, news]);

  // Obtener categorías únicas
  const categories = ['all', ...new Set(news.map((n) => n.category))];

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
            {page === 1 && news.filter((n) => n.featured).length > 0 && (
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
                    .filter((n) => n.featured)
                    .slice(0, 2)
                    .map((item) => (
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
              {paginatedNews.map((item) => (
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
