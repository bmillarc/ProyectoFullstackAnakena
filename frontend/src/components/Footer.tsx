import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { FooterSection } from '../types/footer';
import { Instagram, YouTube, Telegram } from '@mui/icons-material';
import sponsor1 from './../assets/solotodo2.png';

export default function Footer() {
  const footerSections: FooterSection[] = [
    {
      title: "Patrocinadores",
      items: [
        { label: "Hazte Patrocinador", href: "/patrocinios" },
        { label: "Beneficios", href: "/beneficios" }
      ]
    },
    {
      title: "FAQ",
      href: "/faq",
      items: [{label: "Haz una pregunta", href: "/faq"}]
    }
  ];

  const renderSection = (section: FooterSection, index: number) => {
    return (
      <Box
        key={index}
        sx={{
          flex: 1,
          minWidth: '200px',
          mb: { xs: 3, md: 0 }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mb: 1,
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          ★ {section.title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {section.items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              component={RouterLink}
              to={item.href || '/'}
              sx={{
                color: 'rgba(167, 167, 167, 0.9)',
                textDecoration: 'none',
                py: 0.3,
                '&:hover': {
                  color: '#2f8549ff',
                  textDecoration: 'underline'
                },
                fontSize: '0.9rem'
              }}
            >
              {item.label}
            </Link>
          ))}
        </Box>
      </Box>
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#000',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-start' },
          gap: 4
        }}>
          {/* Left Side (Sponsors and Sections) */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            flex: 1
          }}>
            {/* Sponsors Section */}
            <Box sx={{ minWidth: '200px' }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: '1rem'
                }}
              >
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <Box
                  component="img"
                  src={sponsor1}
                  alt="SoloTodo - Patrocinador Oficial"
                  sx={{
                    height: '100px',
                    width: '100px',
                    opacity: 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Navigation Sections */}
            {footerSections.map((section, index) =>
              renderSection(section, index)
            )}
          </Box>

          {/* Right Side (Social and Contact) */}
          <Box sx={{
            minWidth: '250px',
            textAlign: { xs: 'left', md: 'right' }
          }}>
            {/* Social Icons */}
            <Box sx={{ mb: 2 }}>
              <Link href="https://youtube.com/@cdanakena?si=13OYeoRrJpNa38es" sx={{ color: 'white', mr: 1 }}>
                <YouTube />
              </Link>
              <Link href="https://t.me/MonaDccNews" sx={{ color: 'white', mr: 1 }}>
                <Telegram />
              </Link>
              <Link href="https://www.instagram.com/cd_anakena/" sx={{ color: 'white' }}>
                <Instagram />
              </Link>
            </Box>

            {/* Contact Info */}
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.85rem',
                lineHeight: 1.6
              }}
            >
              Santiago, Chile<br />
              contacto@anakena.cl
            </Typography>
          </Box>
        </Box>

        {/* Bottom Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: 4,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem'
            }}
          >
            © {currentYear} Club Anakena DCC. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
