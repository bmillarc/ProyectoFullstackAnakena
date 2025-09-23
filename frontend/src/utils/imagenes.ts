
// Mapea todos los archivos de /src/assets/teams a URLs finales
const images = import.meta.glob('/src/assets/teams/*', {
  eager: true,
  query: '?url',
  import: 'default'
});

export function resolveTeamImage(img?: string) {
  if (!img) return '';

  // Acepta "/assets/teams/foto.jpg" o "foto.jpg" desde JSON
  const filename = img.split('/').pop()!; // por ej. "futbol-masculino.jpg"
  const key = `/src/assets/teams/${filename}`;

  return (images as Record<string, string>)[key] ?? '';
}

export const newsImages = import.meta.glob('/src/assets/news/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function resolveNewsImage(img?: string) {
  if (!img) return '';
  const filename = img.split('/').pop()!; // "olimpiadas-computinas.jpg"
  const key = `/src/assets/news/${filename}`;
  return (newsImages as Record<string, string>)[key] ?? '';
}
