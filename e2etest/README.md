# E2E Tests - Proyecto Anakena

## Descripción

Las pruebas E2E validan el funcionamiento completo de la aplicación desde la perspectiva del usuario, probando la integración entre el frontend y backend.

### Casos de Prueba Implementados

#### 1. Autenticación (`auth.spec.ts`)

- **Abrir modal de Login**: Verifica que el modal se abre al hacer click en "Iniciar Sesión"
- **Validar formato de email**: Prueba validación de email inválido y muestra de alertas de error
- **Navegar entre modales**: Verifica navegación entre Login y Registro usando los enlaces internos
- **Contraseñas no coinciden**: Valida que el registro se bloquea cuando las contraseñas no coinciden
- **Login exitoso y Logout**: Prueba flujo completo de autenticación con mock, verificando cambio de estado del navbar
- **Denegar acceso sin autenticación**: Verifica que endpoint protegido `/api/auth/me` retorna 401 sin autenticación
- **Permitir acceso con autenticación**: Verifica que usuario autenticado puede acceder a endpoints protegidos con CSRF token

#### 2. CRUD de Equipos (`teams.spec.ts`)

- **Listar equipos (READ)**: Obtiene lista completa de equipos desde `/api/teams`
- **Crear equipo (CREATE)**: Crea un nuevo equipo con todos los campos requeridos (sport, name, category, description, founded, captain, playersCount, achievements, nextMatch, image)
- **Leer equipo por ID (READ)**: Obtiene un equipo específico por su ID desde `/api/teams/:id`
- **Actualizar equipo (UPDATE)**: Modifica campos de un equipo existente mediante PUT a `/api/teams/:id`
- **Eliminar equipo (DELETE)**: Elimina un equipo por ID y verifica que retorna 404 al intentar leerlo después
- **Flujo CRUD completo**: Prueba secuencial de CREATE → READ → UPDATE → DELETE verificando cada operación


## Requisitos Previos
Antes de ejecutar las pruebas, asegúrate de tener:

1. **Node.js** (versión 16 o superior)
2. **Dependencias instaladas** en todos los módulos del proyecto:
   ```bash
   # Desde la raíz del proyecto
   npm install

   # O instalar en cada módulo
   cd backend && npm install
   cd ../frontend && npm install
   cd ../e2etest && npm install
   ```

3. **Backend y Frontend configurados**:
   - El backend debe estar configurado para correr en `http://localhost:3001`
   - El frontend debe estar configurado para correr en `http://localhost:5173`


## Instalación
Desde el directorio `e2etest/`:

```bash
npm install
```

### Instalar Navegadores de Playwright

Playwright necesita descargar los navegadores la primera vez:

```bash
npx playwright install
```

## Ejecución de las Pruebas

### Opción 1: Ejecución Automática (Recomendado)

Playwright iniciará automáticamente el backend y frontend antes de ejecutar las pruebas:

```bash
npm test
```

Este comando:
- Inicia el backend en `http://localhost:3001`
- Inicia el frontend en `http://localhost:5173`
- Ejecuta todas las pruebas en modo headless
- Cierra los servidores al finalizar

### Opción 2: Ejecución Manual

Si prefieres iniciar los servidores manualmente:

#### Paso 1: Iniciar Backend
```bash
# Terminal 1 - Desde la raíz del proyecto
cd backend
npm run dev
```

#### Paso 2: Iniciar Frontend
```bash
# Terminal 2 - Desde la raíz del proyecto
cd frontend
npm run dev
```

#### Paso 3: Ejecutar Pruebas
```bash
# Terminal 3 - Desde la raíz del proyecto
cd e2etest
npm test
```

## Comandos Disponibles

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con interfaz gráfica (UI Mode)
npm run test:ui

# Ejecutar pruebas en modo visible (headed)
npm run test:headed

# Ejecutar pruebas solo en Chromium
npm run test:chromium

# Ver reporte de la última ejecución
npm run report
```