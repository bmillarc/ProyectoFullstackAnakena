import { useState, useEffect } from 'react';
import {Box, IconButton, Typography, alpha,} from '@mui/material';
import {ArrowBackIos, ArrowForwardIos,} from '@mui/icons-material';
import type { SliderProps } from '../types/slider';

export default function Slider({ slides, autoPlay = true, autoPlayInterval = 5000 }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 
    autoPlayInterval);

    return () => clearInterval(timer);}, 
    [autoPlay, autoPlayInterval, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box sx={{ position: 'relative', height: 500, overflow: 'hidden' }}>
      {/* Slides Container */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: alpha('#000', 0.4),
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                color: 'white',
                maxWidth: 800,
                px: 3,
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {slide.title}
              </Typography>
              
              {slide.subtitle && (
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  {slide.subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 20,
              transform: 'translateY(-50%)',
              bgcolor: alpha('#000', 0.5),
              color: 'white',
              '&:hover': {
                bgcolor: alpha('#000', 0.7),
              },
              zIndex: 2,
            }}
          >
            <ArrowBackIos />
          </IconButton>
          
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 20,
              transform: 'translateY(-50%)',
              bgcolor: alpha('#000', 0.5),
              color: 'white',
              '&:hover': {
                bgcolor: alpha('#000', 0.7),
              },
              zIndex: 2,
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentSlide ? 'white' : alpha('#fff', 0.5),
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  bgcolor: alpha('#fff', 0.8),
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}