# Anakena DCC: Aplicación Web Fullstack | Hito 1

**Curso:** \[CC5003] Aplicaciones Web Reactivas  
**Profesor:** Matías Toro  
**Auxiliares:** Martín Rojas, Carlos Ruz  
**Ayudantes:** Bastián Corrales, Javier Kauer, Martín Pinochet, Juan Valdivia  
**Fecha de Entrega:** 23-09-25

## Descripción del Proyecto

El portal web Anakena es una aplicación web fullstack desarrollada como parte del **Hito 1** del curso CC5003. El proyecto busca centralizar toda la información deportiva del club Anakena del Departamento de Ciencias de la Computación (DCC) de la Universidad de Chile.

### Motivación

El club deportivo Anakena participa en múltiples disciplinas (fútbol, básquetbol, vóleibol, handball, tenis de mesa, atletismo, entre otros). Actualmente, la información sobre resultados, calendarios, planteles y la historia del club está dispersa en redes sociales, planillas y mensajes, lo que dificulta que estudiantes, docentes y egresados sigan a sus equipos y valoren su trayectoria.

### Solución Propuesta

Desarrollamos una aplicación web **reactiva** (SPA: Single Page Application) que concentra toda la información deportiva de Anakena, permitiendo:

- **Módulo público**: Visualización de resultados, fixture, planteles, perfiles de jugadores e historia del club
- **Navegación fluida**: Sistema de navegación por hash que permite acceso directo a secciones específicas
- **Diseño responsivo**: Interfaz adaptable a diferentes dispositivos usando Material-UI
- **Arquitectura escalable**: Preparada para futuras funcionalidades como autenticación y actualizaciones en tiempo real

## Tecnologías Utilizadas

### Frontend
- **React 19.1.1** con TypeScript
- **Material-UI (MUI) 7.3.2** para componentes y diseño
- **Vite** como build tool y dev server
- **ESLint** para linting de código

### Backend
- **Express 4.18.2** con TypeScript para servidor REST
- **MongoDB** como base de datos NoSQL
- **Mongoose 8.0.0** como ODM para modelado de datos
- **CORS** habilitado para comunicación con frontend

### Herramientas de Desarrollo
- **TypeScript** para tipado estático
- **CSS-in-JS** con Emotion (integrado con MUI)
- **Manejo de assets** con Vite's import.meta.glob

## Estructura del Proyecto

```
ProyectoFullstackAnakena/
├── backend/
│   ├── src/
│   │   ├── models/          # Modelos de Mongoose
│   │   │   ├── teams.ts
│   │   │   ├── players.ts
│   │   │   ├── matches.ts
│   │   │   ├── news.ts
│   │   │   ├── tournaments.ts
│   │   │   ├── events.ts
│   │   │   └── store.ts
│   │   └── index.ts         # Servidor Express
│   ├── .env                 # Variables de entorno
│   ├── .env.example         # Ejemplo de configuración
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/          # Imágenes y recursos estáticos
│   │   │   ├── teams/       # Imágenes de equipos
│   │   │   ├── news/        # Imágenes de noticias
│   │   │   └── ...
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Slider.tsx
│   │   ├── pages/           # Páginas principales
│   │   │   ├── Home.tsx
│   │   │   ├── Teams.tsx
│   │   │   └── ComingSoon.tsx
│   │   ├── services/        # Servicios de API
│   │   │   └── api.ts
│   │   ├── types/           # Definiciones de tipos TypeScript
│   │   │   ├── navbar.ts
│   │   │   ├── footer.ts
│   │   │   └── slider.ts
│   │   ├── utils/           # Utilidades
│   │   │   └── imagenes.ts
│   │   ├── App.tsx          # Componente principal
│   │   └── Main.tsx         # Punto de entrada
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## Funcionalidades Implementadas (Hito 1)

### Vistas Completas Desarrolladas

1. **Página de Inicio (Home)**
   - Slider con imágenes representativas del club
   - Estadísticas del club en formato de tarjetas
   - Sección de últimas noticias con integración a la API
   - Navegación

2. **Página de Equipos (Teams)**
   - Grid responsivo con todos los equipos del club
   - Información detallada por equipo (fundación, capitán, logros)
   - Modal con detalles completos y plantel de jugadores
   - Próximos partidos por equipo
   - Iconos diferenciados por deporte

### Componentes Reutilizables

1. **Navbar**: Navegación responsiva con drawer móvil
2. **Footer**: Enlaces de navegación, redes sociales y patrocinadores
3. **Slider**: Carrusel automático con controles manuales
4. **ComingSoon**: Página placeholder para funcionalidades futuras

### Servicios y Arquitectura

- **API Service**: Clase centralizada para todas las llamadas a la API REST
- **Manejo de Estado**: useState para interacciones del usuario
- **Gestión de Imágenes**: Sistema dinámico de resolución de assets
- **Navegación por Hash**: Sistema SPA con URLs amigables

## Modelo de Datos

La aplicación maneja las siguientes entidades principales:

### Teams (Equipos)
```typescript
interface Team {
  id: number;
  sport: string;
  name: string;
  category: 'Masculino' | 'Femenino' | 'Mixto';
  description: string;
  founded: string;
  captain: string;
  playersCount: number;
  achievements: string[];
  nextMatch?: NextMatch;
  image: string;
}
```

### Players (Jugadores)
```typescript
interface Player {
  id: number;
  name: string;
  teamId: number;
  position: string;
  number?: number;
  age: number;
  carrera: string;
  isCaptain: boolean;
}
```

### News (Noticias)
```typescript
interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  teamId?: number;
  featured: boolean;
}
```

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- MongoDB (versión 6 o superior) - [Descargar aquí](https://www.mongodb.com/try/download/community)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/bmillarc/ProyectoFullstackAnakena/tree/hito-1
cd ProyectoFullstackAnakena
```

2. **Instalar y configurar MongoDB**
   - Instalar MongoDB Community Server
   - Iniciar el servicio de MongoDB (usualmente se inicia automáticamente)
   
3. **Configurar el backend**
```bash
cd backend
npm install
# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración de MongoDB
```

4. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

### Ejecución

**Importante**: Ambos servidores deben ejecutarse simultáneamente en terminales separadas.

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
El servidor estará disponible en: `http://localhost:3001`

Verás un mensaje como:
```
🚀 Server running on http://localhost:3001
📊 MongoDB connection: mongodb://localhost:27017/anakena_db
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

### Comandos Adicionales

#### Frontend
```bash
# Construcción para producción
npm run build

# Linting de código
npm run lint

# Vista previa de build de producción
npm run preview
```

#### Backend
```bash
# Modo desarrollo con auto-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar servidor compilado
npm start
```

## Decisiones de Diseño y Arquitectura

### Frontend

1. **Material-UI como sistema de diseño**
   - Componentes consistentes y accesibles
   - Tema personalizado con colores de Anakena
   - Sistema de breakpoints responsivo

2. **Arquitectura de Componentes**
   - Componentes funcionales con hooks
   - Separación clara entre componentes de UI y lógica de negocio
   - Props tipadas con TypeScript

3. **Manejo de Estado**
   - useState para estado local de componentes
   - Servicios centralizados para llamadas API
   - Error handling y fallbacks a datos mock

4. **Sistema de Navegación**
   - Hash-based routing para SPA simple
   - Estado sincronizado con URL
   - Soporte para navegación con botones del browser

### Backend

1. **Express + TypeScript**
   - Servidor REST completo con tipado estático
   - Middleware de logging y manejo de errores
   - CORS habilitado para desarrollo

2. **MongoDB con Mongoose**
   - Modelos con validaciones robustas
   - Relaciones entre entidades (teams/players)
   - Schemas con timestamps automáticos

3. **Endpoints REST**
   - CRUD completo para todas las entidades
   - Query params para filtrado (ej: `/api/players?teamId=1`)
   - Códigos HTTP estándar y manejo de errores consistente

4. **Entidades Modeladas**
   - **Teams**: Equipos deportivos con información completa
   - **Players**: Jugadores con relación a equipos
   - **Matches**: Partidos con resultados y estado
   - **News**: Noticias del club con categorías
   - **Tournaments**: Torneos activos y completados
   - **Events**: Eventos del calendario
   - **Store**: Productos de la tienda del club

## Priorización de Funcionalidades

### Alta Prioridad (Implementado)
- **Visualización de equipos**: Información completa de 6 equipos del club
- **Información de jugadores**: Planteles detallados por equipo  
- **Navegación principal**: Sistema de navegación funcional
- **Diseño responsivo**: Adaptación a dispositivos móviles y desktop

### Media Prioridad (Próximos Hitos)
- **Noticias completas**: Sistema de gestión de noticias con contenido expandido
- **Calendario de partidos**: Vista de calendario con próximos encuentros
- **Historia del club**: Línea de tiempo interactiva
- **Estadísticas avanzadas**: Métricas detalladas por jugador y equipo


### Baja Prioridad (Futuro)
- **Sistema de autenticación**: Login para capitanes y dirigencia
- **Tienda online**: Merch del club
- **Notificaciones push?**: Alertas de partidos y resultados
- **Sistema de comentarios?**: Interacción de la comunidad

## Próximos Pasos Posibles (Hitos Futuros)

**Hito 2**: 
   - ✅ Backend real con Express + TypeScript + MongoDB
   - ✅ Modelos de Mongoose con validaciones
   - ✅ Endpoints REST completos (CRUD)
   - ✅ Manejo de errores consistente
   - Implementación completa del sistema de noticias
   - Desarrollo del calendario interactivo
   - Mejoras en UX/UI basadas en feedback
   - Sistema de autenticación

## API Endpoints

El backend expone los siguientes endpoints REST:

### Teams (Equipos)
- `GET /api/teams` - Listar todos los equipos
- `GET /api/teams/:id` - Obtener equipo por ID
- `POST /api/teams` - Crear nuevo equipo
- `PUT /api/teams/:id` - Actualizar equipo
- `DELETE /api/teams/:id` - Eliminar equipo

### Players (Jugadores)
- `GET /api/players` - Listar jugadores (soporta `?teamId=1`)
- `GET /api/players/:id` - Obtener jugador por ID
- `POST /api/players` - Crear jugador
- `PUT /api/players/:id` - Actualizar jugador
- `DELETE /api/players/:id` - Eliminar jugador

### Matches (Partidos)
- `GET /api/matches` - Listar partidos (soporta `?teamId=1`)
- `GET /api/matches/:id` - Obtener partido por ID
- `POST /api/matches` - Crear partido
- `PUT /api/matches/:id` - Actualizar partido
- `DELETE /api/matches/:id` - Eliminar partido

### News (Noticias)
- `GET /api/news` - Listar noticias (soporta `?featured=true`)
- `GET /api/news/:id` - Obtener noticia por ID
- `POST /api/news` - Crear noticia
- `PUT /api/news/:id` - Actualizar noticia
- `DELETE /api/news/:id` - Eliminar noticia

### Tournaments, Events y Store
- Endpoints similares disponibles para torneos, eventos y tienda

## Problemas Conocidos y Limitaciones

1. **Imágenes mock**: Algunas imágenes de equipos son placeholders
2. **Falta de testing**: Pendiente implementación de tests unitarios
3. **Sin autenticación**: Endpoints públicos sin protección
4. **Datos iniciales**: La base de datos comienza vacía (puedes poblarla manualmente)

## Equipo de Desarrollo

**[CC5003] Hito 1 | Equipo 102**

- **Ignacio Balbontín**
- **Pablo Reyes**  
- **Benjamín Millar**
- **Camila Rojas**

---

**Nota**: Este proyecto está en desarrollo activo como parte del curso CC5003. La funcionalidad completa estará disponible en los próximos hitos del proyecto.