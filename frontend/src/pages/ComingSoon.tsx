import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { Construction, AccessTime } from '@mui/icons-material';

interface ComingSoonProps {
  pageName: string;
  description?: string;
}

export default function ComingSoon({ 
  pageName, 
  description = "Esta funcionalidad estará disponible en los próximos hitos del proyecto." 
}: ComingSoonProps) {
  
  // Funcion de navegación
  const handleNavigation = (page: string) => {
    window.location.hash = `#${page}`;
  };

  return (
    <Box>
      {/* Header Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.light',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Construction sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
          <Typography variant="h2" component="h1" gutterBottom>
            {pageName}
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Próximamente disponible
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container sx={{ py: 6 }}>
        <Card 
          sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            textAlign: 'center',
            p: 4
          }}
        >
          <CardContent>
            <AccessTime 
              sx={{ 
                fontSize: 80, 
                color: 'primary.main', 
                mb: 3 
              }} 
            />
            
            <Typography variant="h4" component="h2" gutterBottom>
              En Construcción
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
              sx={{ mb: 4 }}
            >
              {description}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
            >
              Mientras tanto, puedes explorar:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={() => handleNavigation('inicio')}
              >
                Volver al Inicio
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => handleNavigation('equipos')}
              >
                Ver Equipos
              </Button>
            </Box>
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: 'block', mt: 4 }}
            >
              Implementación planificada para los siguientes hitos del proyecto
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}