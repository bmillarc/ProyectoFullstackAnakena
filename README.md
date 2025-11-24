# Anakena DCC: Aplicación Web Fullstack | Hito 3

**Curso:** \[CC5003] Aplicaciones Web Reactivas  
**Profesor:** Matías Toro  
**Auxiliares:** Martín Rojas, Carlos Ruz  
**Ayudantes:** Bastián Corrales, Javier Kauer, Martín Pinochet, Juan Valdivia  
**Fecha de Entrega Hito 2:** 23-11-25

## Descripción General del Proyecto

Este proyecto corresponde a una aplicación web fullstack desarrollada para el Club Deportivo Anakena del Departamento de Ciencias de la Computación (DCC) de la Universidad de Chile. La aplicación permite gestionar información sobre equipos deportivos, jugadores, partidos, noticias, torneos, eventos y una tienda de productos oficiales del club.

La plataforma incluye funcionalidades de autenticación de usuarios, acceso a rutas protegidas, gestión de contenido dinámico y una interfaz moderna construida con React y Material UI. El backend está desarrollado con Node.js, Express y MongoDB, proporcionando una API RESTful completa.

## Tecnologías Utilizadas

### Frontend
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2
- Material UI 7.3.2
- React Router DOM 7.9.6
- Zustand 4.5.2 para manejo de estado global

### Backend
- Node.js con Express 4.21.2
- TypeScript 5.9.3
- MongoDB con Mongoose 8.19.2
- JSON Web Tokens (jsonwebtoken 9.0.2)
- bcrypt 6.0.0 para encriptación de contraseñas
- cookie-parser 1.4.7 para manejo de cookies
- CORS 2.8.5

### Testing
- Playwright 1.56.1 para pruebas End-to-End

### Herramientas de Desarrollo
- ESLint 9.33.0
- ts-node-dev 2.0.0
- dotenv 16.6.1

## Estructura del Estado Global

El proyecto utiliza Zustand para el manejo del estado global de la aplicación, implementado a través de múltiples stores independientes:

### authStore
Ubicado en `frontend/src/store/authStore.ts`, este store maneja todo lo relacionado con la autenticación de usuarios:

- **Estado gestionado:**
  - `user`: Objeto con información del usuario autenticado (id, username, email)
  - `isAuthenticated`: Booleano que indica si hay un usuario autenticado
  - `isLoading`: Booleano para indicar estados de carga

- **Funciones proporcionadas:**
  - `login(credentials)`: Autenticación de usuarios existentes
  - `register(data)`: Registro de nuevos usuarios
  - `logout()`: Cierre de sesión
  - `refreshUser()`: Actualización de datos del usuario

- **Persistencia:** Utiliza localStorage de manera segura mediante wrappers personalizados (safeStorage.ts) para almacenar información básica del usuario y tokens CSRF.

- **Inicialización:** Al cargar el store, automáticamente verifica si hay un usuario en localStorage y valida su sesión con el backend.

### notificationStore
Ubicado en `frontend/src/store/notificationStore.ts`, maneja las notificaciones y mensajes al usuario:

- **Estado gestionado:**
  - Mensajes de notificación (texto y severidad)
  - Estado de visibilidad del Snackbar

- **Funciones proporcionadas:**
  - `showNotification(message, severity)`: Muestra notificaciones al usuario con diferentes niveles de severidad (info, success, warning, error)
  - `hide()`: Oculta la notificación actual

### teamsStore
Ubicado en `frontend/src/store/teamsStore.ts`, gestiona el estado de equipos y jugadores:

- **Estado gestionado:**
  - `teams`: Lista de equipos con iconos e imágenes resueltas
  - `loading`: Estado de carga de equipos
  - `error`: Mensajes de error
  - `selectedTeam`: Equipo actualmente seleccionado
  - `players`: Lista de jugadores del equipo seleccionado
  - `playersLoading`: Estado de carga de jugadores

- **Funciones proporcionadas:**
  - `loadTeams()`: Carga todos los equipos desde la API (con fallback a datos mock)
  - `selectTeam(team)`: Selecciona un equipo y carga sus jugadores
  - `clearSelection()`: Limpia la selección actual

### newsStore
Ubicado en `frontend/src/store/newsStore.ts`, gestiona el estado de noticias:

- **Estado gestionado:**
  - `news`: Lista de noticias ordenadas por fecha
  - `loading`: Estado de carga
  - `error`: Mensajes de error

- **Funciones proporcionadas:**
  - `loadNews()`: Carga todas las noticias desde la API con imágenes resueltas (con fallback a datos mock)

### calendarStore
Ubicado en `frontend/src/store/calendarStore.ts`, gestiona el estado del calendario de eventos:

- **Estado gestionado:**
  - `currentDate`: Fecha del mes actual mostrado
  - `selectedDate`: Fecha seleccionada por el usuario
  - `expandedEventId`: ID del evento expandido en la vista
  - `events`: Lista de eventos del calendario

- **Funciones proporcionadas:**
  - `setMonthOffset(offset)`: Navega entre meses
  - `selectDate(date)`: Selecciona una fecha específica
  - `toggleExpandEvent(eventId)`: Expande/contrae detalles de un evento
  - `getEventsForDate(date)`: Obtiene eventos de una fecha específica
  - `isSameDay(a, b)`: Utilidad para comparar fechas

### storeStore
Ubicado en `frontend/src/store/storeStore.ts`, gestiona productos de la tienda y carrito de compras:

- **Estado gestionado:**
  - `items`: Catálogo de productos disponibles
  - `cart`: Items en el carrito con cantidades

- **Funciones proporcionadas:**
  - `addToCart(item)`: Agrega un producto al carrito (incrementa cantidad si ya existe)
  - `removeFromCart(id)`: Reduce cantidad o elimina del carrito
  - `clearCart()`: Vacía el carrito completamente
  - `totalItems()`: Retorna el total de items en el carrito
  - `findInCart(id)`: Busca un producto específico en el carrito

- **Persistencia:** Utiliza el middleware `persist` de Zustand para mantener el carrito en localStorage bajo la clave `anakena-store-cart`

### Ventajas de Zustand sobre Context API

1. **Simplicidad:** No requiere providers envolviendo la aplicación
2. **Performance:** Re-renderiza solo los componentes que usan el estado específico modificado
3. **DevTools:** Soporte nativo para Redux DevTools
4. **Middleware:** Fácil integración de persist y otros middlewares
5. **TypeScript:** Excelente inferencia de tipos sin boilerplate adicional
6. **Tamaño:** Librería muy ligera (~1KB gzipped)

## Mapa de Rutas y Flujo de Autenticación

### Configuración de Rutas
El sistema de ruteo está implementado con React Router DOM v7 en `frontend/src/App.tsx`:

#### Rutas Públicas
- `/` - Página de inicio (Home)
- `/equipos` - Listado de equipos deportivos (Teams)
- `/noticias` - Sección de noticias (News)
- `/historia` - Historia del club (History)
- `/calendario` - Calendario de eventos (Calendar)

#### Rutas Protegidas
- `/tienda` - Tienda de productos (Store)
  - Requiere autenticación mediante el componente ProtectedRoute
  - Redirige a la página principal si el usuario no está autenticado

### Flujo de Autenticación

#### 1. Registro de Usuario
```
Usuario → Click "Registrarse" → RegisterDialog → 
POST /api/auth/register → Backend valida datos → 
Crea usuario en MongoDB → Retorna JWT + CSRF token → 
Almacena en localStorage → Actualiza authStore → 
Cierra dialog → Usuario autenticado
```

#### 2. Inicio de Sesión
```
Usuario → Click "Iniciar Sesión" → LoginDialog → 
POST /api/auth/login → Backend valida credenciales → 
Compara contraseña con bcrypt → Retorna JWT + CSRF token → 
Almacena en localStorage → Actualiza authStore → 
Cierra dialog → Usuario autenticado
```

#### 3. Protección de Rutas
El componente `ProtectedRoute` (frontend/src/components/ProtectedRoute.tsx) implementa el siguiente flujo:

```
Usuario intenta acceder a ruta protegida → 
ProtectedRoute verifica isAuthenticated → 
Si está autenticado: renderiza componente solicitado → 
Si no está autenticado: 
  - Muestra notificación "Debes iniciar sesión" → 
  - Redirige a "/" → 
  - Guarda location intentada en state
```

#### 4. Verificación de Sesión
Al cargar la aplicación, authStore ejecuta automáticamente:
```
Inicialización del store → Verifica localStorage → 
Si hay datos almacenados: 
  - GET /api/auth/me con CSRF token → 
  - Backend valida token → 
  - Retorna datos actualizados → 
  - Actualiza estado del usuario en el store
Si no hay datos o token inválido:
  - Limpia localStorage → 
  - Establece isAuthenticated = false
Finaliza → isLoading = false
```

#### 5. Cierre de Sesión
```
Usuario → Click "Cerrar Sesión" → 
POST /api/auth/logout → 
Backend limpia cookies → 
Frontend limpia localStorage → 
Actualiza authStore (user = null, isAuthenticated = false) → 
Redirige a página principal
```

### Seguridad Implementada

1. **Tokens JWT en HttpOnly Cookies:** Los tokens de autenticación se almacenan en cookies HttpOnly, protegiéndolos contra ataques XSS.

2. **Tokens CSRF:** Se implementa protección CSRF mediante tokens que se validan en cada petición protegida.

3. **Encriptación de Contraseñas:** bcrypt con salt rounds de 10 para hash seguro de contraseñas.

4. **Validación en Frontend y Backend:** Validaciones duplicadas para prevenir envío de datos inválidos.

5. **CORS Configurado:** Lista blanca de orígenes permitidos con soporte para credenciales.

## Descripción de los Tests E2E

### Herramienta Utilizada
Playwright 1.56.1 es el framework seleccionado para las pruebas End-to-End. Se eligió Playwright por:
- Soporte multi-navegador (Chromium, Firefox, WebKit)
- API moderna y poderosa
- Buenas herramientas de debugging
- Capacidad de interceptar y mockear requests

### Estructura de Tests
Los tests se encuentran en la carpeta `e2etest/` con la siguiente estructura:

```
e2etest/
├── tests/
│   ├── auth.spec.ts      # Tests de autenticación
│   └── teams.spec.ts     # Tests CRUD de equipos
├── playwright.config.ts  # Configuración de Playwright
└── package.json
```

### Flujos Cubiertos

#### 1. Tests de Autenticación (auth.spec.ts)

**Test: Abrir modal de Login**
- Verifica que el modal de login se abre correctamente al hacer click en "Iniciar Sesión"
- Confirma la presencia del dialog mediante su rol y título

**Test: Validación de formularios**
- Valida que el formulario de login requiere email y contraseña
- Verifica que se muestra error cuando el formato del email es inválido
- Confirma que aparecen alertas visuales ante errores

**Test: Navegación entre Login y Registro**
- Valida la navegación fluida entre modales de Login y Registro
- Verifica que los modales se alternan correctamente sin perder estado

**Test: Validación de contraseñas en registro**
- Confirma que el sistema rechaza registros cuando las contraseñas no coinciden
- Verifica el mensaje de error específico mostrado al usuario

**Test: Flujo completo de autenticación**
- Mockea el endpoint `/api/auth/login` para simular respuesta exitosa
- Realiza login completo con credenciales válidas
- Verifica que aparece el saludo con el nombre de usuario
- Ejecuta el flujo de cierre de sesión
- Confirma que el estado vuelve al inicial (no autenticado)

**Test: Acceso denegado a rutas protegidas**
- Intenta acceder al endpoint `/api/auth/me` sin autenticación
- Verifica que retorna código 401 Unauthorized

**Test: Acceso permitido con autenticación**
- Mockea endpoints de login y `/api/auth/me`
- Realiza login exitoso
- Verifica que el CSRF token se envía correctamente en los headers
- Confirma que el acceso a recursos protegidos es exitoso

#### 2. Tests CRUD de Equipos (teams.spec.ts)

**Setup (beforeEach)**
- Limpia equipos de prueba (IDs 995-999) antes de cada test
- Asegura un estado limpio para evitar conflictos entre tests

**Test: Listar equipos (READ)**
- Ejecuta GET `/api/teams`
- Verifica código de respuesta 200
- Confirma que retorna un array

**Test: Crear equipo (CREATE)**
- Crea un equipo completo con todos sus campos
- POST `/api/teams` con datos del nuevo equipo
- Verifica código 201 y que los datos retornados coinciden

**Test: Leer equipo específico (READ)**
- Crea un equipo de prueba
- Ejecuta GET `/api/teams/{id}`
- Verifica que los datos del equipo son correctos

**Test: Actualizar equipo (UPDATE)**
- Crea un equipo inicial
- Ejecuta PUT `/api/teams/{id}` con datos modificados
- Verifica que solo los campos enviados se actualizaron
- Confirma que los demás campos permanecen sin cambios

**Test: Eliminar equipo (DELETE)**
- Crea un equipo temporal
- Ejecuta DELETE `/api/teams/{id}`
- Verifica código 204 (No Content)
- Confirma que el equipo ya no existe (GET retorna 404)

**Test: Flujo CRUD completo**
- Ejecuta secuencialmente: CREATE → READ → UPDATE → DELETE
- Valida cada paso del ciclo de vida completo de una entidad
- Verifica que todas las operaciones se completan exitosamente

### Configuración de Tests

El archivo `playwright.config.ts` incluye:
- Tests en paralelo para mayor velocidad
- Reintentos automáticos en CI (2 veces)
- Soporte para Chromium, Firefox y WebKit
- Trazas automáticas en fallos para debugging
- Base URL configurada a `http://localhost:5173`

### Ejecución de Tests

Los tests requieren que tanto backend como frontend estén ejecutándose:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal: Frontend
cd frontend
npm run dev

# Terminal 3: Tests
cd e2etest
npm test                   # Ejecutar todos los tests
npm run test:ui            # Modo UI interactivo
npm run test:headed        # Ver ejecución en navegador
```

### Cobertura de Tests

Los tests cubren los siguientes aspectos críticos:
1. Autenticación completa (registro, login, logout)
2. Protección de rutas
3. Validación de formularios
4. Manejo de errores
5. Operaciones CRUD completas
6. Integración frontend-backend
7. Persistencia de estado

## Librería de Estilos y Decisiones de Diseño

### Librería Principal: Material UI (MUI) v7.3.2

Se seleccionó Material UI como la librería de componentes y estilos por las siguientes razones:

1. **Ecosistema Completo:** Proporciona componentes pre-construidos, sistema de theming y utilidades de layout
2. **Accesibilidad:** Componentes con soporte ARIA integrado
3. **Personalización:** Sistema de theming flexible mediante `createTheme`
4. **TypeScript:** Excelente soporte y tipado completo
5. **Documentación:** Extensa y con ejemplos prácticos
6. **Comunidad:** Amplia comunidad y soporte a largo plazo

### Tema Personalizado

El tema de la aplicación está definido en `frontend/src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2f8549ff',    // Verde institucional Anakena
      dark: '#073d23ff',    // Verde oscuro
      light: '#297438ff',   // Verde claro
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
```

### Paleta de Colores

- **Primary Green (#2f8549):** Color principal del club Anakena, utilizado en navbar, botones principales y elementos destacados
- **Dark Green (#073d23):** Para hover states y elementos de énfasis
- **Light Green (#297438):** Headers de secciones y fondos sutiles
- **Secondary Pink (#f50057):** Elementos de acción secundarios
- **Background (#fafafa):** Fondo general de la aplicación para mejor legibilidad

### Componentes Principales Utilizados

#### Layout y Navegación
- `AppBar` y `Toolbar`: Barra de navegación superior
- `Drawer`: Menú lateral para móviles
- `Container`: Contenedor responsivo para contenido
- `Box`: Componente de layout flexible

#### Formularios y Inputs
- `TextField`: Inputs para formularios de login/registro
- `Button`: Botones de acción en toda la aplicación
- `Select` y `MenuItem`: Filtros en página de noticias
- `InputAdornment`: Íconos en campos de búsqueda

#### Visualización de Datos
- `Card`, `CardMedia`, `CardContent`, `CardActions`: Tarjetas para equipos, noticias y productos
- `List`, `ListItem`, `ListItemText`: Listas de jugadores y logros
- `Chip`: Etiquetas para categorías y estados
- `Avatar`: Avatares para jugadores

#### Feedback y Diálogos
- `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`: Modales para login, registro y detalles
- `Alert` y `Snackbar`: Notificaciones y mensajes al usuario
- `CircularProgress`: Indicadores de carga
- `Pagination`: Paginación en listados

#### Íconos
- `@mui/icons-material`: Librería de íconos Material Design (SportsSoccer, SportsBasketball, AccountCircle, etc.)

### Decisiones de Diseño Visual

#### 1. Diseño Responsivo
- Sistema de Grid con breakpoints: `xs`, `sm`, `md`, `lg`
- Layouts adaptativos mediante `display: grid` con columnas responsivas
- Drawer colapsable en móviles, menú horizontal en desktop

#### 2. Jerarquía Visual
- Uso de Typography variants (h1-h6, body1-body2) para estructura clara
- Espaciado consistente mediante sistema `sx` de MUI (múltiplos de 8px)
- Elevación mediante `boxShadow` para elementos interactivos

#### 3. Interactividad
- Transiciones suaves en hover (`transition: 'all 0.3s'`)
- Efecto de elevación en cards al hacer hover (`transform: 'translateY(-4px)'`)
- Estados visuales claros (loading, error, success)

#### 4. Accesibilidad
- Roles ARIA en componentes interactivos
- Labels descriptivos en todos los formularios
- Navegación por teclado soportada

#### 5. Consistencia
- Paleta de colores limitada y consistente
- Espaciado uniforme en toda la aplicación
- Componentes reutilizables (Footer, Navbar, ProtectedRoute)
- Estructura de layout predecible

### Componentes Personalizados

#### Slider (frontend/src/components/Slider.tsx)
Carrusel personalizado para el 'hero' de la página principal con:
- Transiciones automáticas configurables
- Navegación manual con flechas
- Indicadores de posición (dots)
- Overlay oscuro para mejor legibilidad del texto

#### Footer (frontend/src/components/Footer.tsx)
Footer institucional con:
- Secciones organizadas (patrocinadores, FAQ, social, contacto)
- Links internos con React Router
- Íconos de redes sociales
- Diseño responsivo de columnas

#### NotificationHost (frontend/src/components/NotificationHost.tsx)
Componente global que renderiza notificaciones usando `notificationStore`:
- Snackbar con Alert de Material UI
- Cierre automático después de 6 segundos
- Posicionamiento superior centrado
- Diferentes severidades (success, error, warning, info)

#### NewsDetail (frontend/src/components/NewsDetail.tsx)
Dialog fullscreen para mostrar noticias completas con:
- Imagen destacada
- Metadatos (fecha, autor, categoría)
- Contenido formateado
- Botón de compartir

### CSS y Estilos Adicionales

- `index.css`: Estilos globales básicos y variables CSS
- No se utiliza CSS Modules ni styled-components para mantener simplicidad

## URL de la Aplicación Desplegada

**Servidor:** fullstack.dcc.uchile.cl  
**Puerto:** 7112  
**URL Frontend:** http://fullstack.dcc.uchile.cl:7112  
**URL Backend API:** http://fullstack.dcc.uchile.cl:7112/api

### Acceso a la Aplicación

La aplicación está completamente funcional y desplegada. Para acceder:

1. Navegar a http://fullstack.dcc.uchile.cl:7112
2. La página principal carga automáticamente
3. Para acceder a rutas protegidas (como la tienda), es necesario crear una cuenta o iniciar sesión

### Endpoints Principales del API

- `GET /api/teams` - Obtener todos los equipos
- `GET /api/teams/:id` - Obtener equipo específico
- `GET /api/players?teamId=:id` - Obtener jugadores de un equipo
- `GET /api/news` - Obtener todas las noticias
- `GET /api/news?featured=true` - Obtener noticias destacadas
- `GET /api/matches` - Obtener partidos
- `GET /api/tournaments` - Obtener torneos
- `GET /api/events` - Obtener eventos del calendario
- `GET /api/store` - Obtener productos de la tienda
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/me` - Obtener usuario actual (protegido)

## Estructura del Proyecto

```
proyecto-anakena/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── authMiddleware.ts
│   │   ├── models/
│   │   │   ├── events.ts
│   │   │   ├── matches.ts
│   │   │   ├── news.ts
│   │   │   ├── players.ts
│   │   │   ├── store.ts
│   │   │   ├── teams.ts
│   │   │   ├── tournaments.ts
│   │   │   └── user.ts
│   │   ├── routes/
│   │   │   └── authRoutes.ts
│   │   └── index.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NewsDetail.tsx
│   │   │   ├── NotificationHost.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Slider.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── calendarStore.ts
│   │   │   ├── newsStore.ts
│   │   │   ├── notificationStore.ts
│   │   │   ├── storeStore.ts
│   │   │   └── teamsStore.ts
│   │   ├── pages/
│   │   │   ├── Calendar.tsx
│   │   │   ├── ComingSoon.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── News.tsx
│   │   │   ├── Store.tsx
│   │   │   └── Teams.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── authService.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── calendar.ts
│   │   │   ├── footer.ts
│   │   │   ├── navbar.ts
│   │   │   ├── slider.ts
│   │   │   └── store.ts
│   │   ├── utils/
│   │   │   ├── imagenes.ts
│   │   │   └── safeStorage.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── e2etest/
│   ├── tests/
│   │   ├── auth.spec.ts
│   │   └── teams.spec.ts
│   ├── package.json
│   └── playwright.config.ts
├── .gitignore
├── package.json
└── README.md
```

## Instalación y Ejecución

### Prerrequisitos
- Node.js 20.x o superior
- MongoDB 6.0 o superior
- npm

### Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/bmillarc/ProyectoFullstackAnakena.git
cd ProyectoFullstackAnakena
git checkout hito-3
```

#### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

#### 3. Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

#### 4. Instalar dependencias de Tests E2E
```bash
cd ../e2etest
npm install
npx playwright install  # Instalar navegadores
```

### Ejecución en Desarrollo

#### Backend
```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm run dev
# Aplicación corriendo en http://localhost:5173
```

#### Tests E2E
```bash
# Asegurar de que backend y frontend estén corriendo
cd e2etest
npm test                   # Ejecutar todos los tests
npm run test:ui            # Modo interactivo
npm run test:headed        # Ver ejecución en navegador
```

## Funcionalidades Principales

### Gestión de Equipos
- Visualización de todos los equipos deportivos del club
- Información detallada de cada equipo (capitán, jugadores, logros, próximos partidos)
- Listado de jugadores por equipo con sus posiciones y datos personales

### Sistema de Noticias
- Publicación y visualización de noticias del club
- Noticias destacadas en la página principal
- Filtrado por categoría y búsqueda de noticias
- Sistema de paginación
- Vista detallada de cada noticia

### Calendario de Eventos
- Visualización mensual de eventos deportivos
- Detalles de entrenamientos, y actividades sociales
- Filtrado por fecha

### Historia del Club
- Línea de tiempo con eventos históricos importantes
- Categorización de eventos (fundación, logros, expansión, hitos)
- Estadísticas del club

### Tienda (Ruta Protegida)
- Catálogo de productos oficiales del club
- Información de compra y contacto
- Acceso exclusivo para usuarios registrados

### Sistema de Autenticación
- Registro de nuevos usuarios
- Inicio y cierre de sesión
- Protección de rutas sensibles
- Gestión segura de tokens y sesiones

## Equipo de Desarrollo

**[CC5003] Equipo 102**

- **Ignacio Balbontín**
- **Pablo Reyes**  
- **Benjamín Millar**
- **Camila Rojas**