import { useState } from 'react';
import { Box, Typography, Container, Card, CardMedia, CardContent, Alert, AlertTitle, Chip } from '@mui/material';
import { ShoppingBag, Info } from '@mui/icons-material';
import type { StoreItem } from '../types/store';

//Datos de ejemplo
const mockStoreItems: StoreItem[] = [
  {
    id: 1,
    label: 'Polera Anakena (local)',
    price: '$$$$',
    image: 'https://via.placeholder.com/300x300/1a1a1a/00ff00?text=Polera+Local',
    category: 'Poleras'
  },
  {
    id: 2,
    label: 'Polera Anakena (visita)',
    price: '$$$$',
    image: 'https://via.placeholder.com/300x300/4ade80/ffffff?text=Polera+Visita',
    category: 'Poleras'
  },
  {
    id: 3,
    label: 'Polera Anakena (DR)',
    price: '$$$$',
    image: 'https://via.placeholder.com/300x300/ffffff/1a1a1a?text=Polera+DR',
    category: 'Poleras'
  },
];

export default function Store() {
  const [items] = useState<StoreItem[]>(mockStoreItems);

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
      <Container>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <ShoppingBag sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Tienda Anakena
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Productos oficiales
          </Typography>
        </Box>

        {/* Instructions Card */}
        <Alert 
          severity="info" 
          icon={<Info />}
          sx={{ 
            mb: 6,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            ¿Cómo comprar?
          </AlertTitle>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" paragraph>
              Para realizar tu pedido, sigue estos pasos:
            </Typography>
            
            <Box component="ol" sx={{ pl: 2, '& li': { mb: 1.5 } }}>
              <li>
                <Typography variant="body1">
                  <strong>Realiza una transferencia</strong> a la siguiente cuenta:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1, 
                  mt: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  <Typography variant="body2" fontFamily="monospace">
                    <strong>Banco:</strong> Banco Estado<br />
                    <strong>Tipo:</strong> Cuenta Corriente<br />
                    <strong>N° Cuenta:</strong> 12345678-9<br />
                    <strong>RUT:</strong> 12.345.678-9<br />
                    <strong>Nombre:</strong> Club Deportivo Anakena DCC
                  </Typography>
                </Box>
              </li>
              
              <li>
                <Typography variant="body1">
                  En el <strong>asunto de la transferencia</strong>, indica:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'primary.50', 
                  p: 1.5, 
                  borderRadius: 1, 
                  mt: 1,
                  border: '1px solid',
                  borderColor: 'primary.200'
                }}>
                  <Typography variant="body2" fontFamily="monospace">
                    Nombre del producto + Talla (Si aplica)<br />
                    <em>Ejemplo: "Polera Local - Talla M"</em>
                  </Typography>
                </Box>
              </li>
              
              <li>
                <Typography variant="body1">
                  Envía una <strong>copia del comprobante</strong> de transferencia al correo:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 1.5, 
                  borderRadius: 1, 
                  mt: 1,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold" 
                    color="primary.main"
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '1.1rem'
                    }}
                  >
                    tienda.anakena@gmail.com
                  </Typography>
                </Box>
              </li>
              
              <li>
                <Typography variant="body1">
                  Recibirás un <strong>correo de confirmación</strong> con:
                </Typography>
                <Box sx={{ pl: 2, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Confirmación de tu pedido<br />
                    • Fecha estimada de entrega<br />
                    • Lugar de retiro
                  </Typography>
                </Box>
              </li>
            </Box>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> Los pedidos se procesan en orden de llegada. 
                El tiempo de entrega puede variar entre 7 a 15 días hábiles.
              </Typography>
            </Alert>
          </Box>
        </Alert>

        {/* Products Grid */}
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
          Productos Disponibles
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 4
        }}>
          {items.map((item) => (
            <Card 
              key={item.id}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={item.image}
                alt={item.label}
                sx={{ 
                  objectFit: 'cover',
                  bgcolor: 'grey.100'
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {item.category && (
                  <Chip 
                    label={item.category} 
                    size="small" 
                    color="primary"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                )}
                <Typography variant="h6" component="h3" fontWeight="bold">
                  {item.label}
                </Typography>
                <Typography 
                  variant="h5" 
                  color="primary.main" 
                  fontWeight="bold"
                  sx={{ mt: 'auto' }}
                >
                  {item.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tallas disponibles: XS, S, M, L, XL, XXL
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Footer Note */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ¿Tienes alguna duda? Escríbenos a{' '}
            <Typography 
              component="span" 
              color="primary.main" 
              fontWeight="bold"
            >
              tienda.anakena@gmail.com
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}