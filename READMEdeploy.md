# Anakena DCC: Aplicación Web Fullstack | Guía de Deploy por SSH

Esta guía explica cómo realizar el deploy de la aplicación Anakena Fullstack al servidor mediante SSH.

## Requisitos Previos

- Acceso SSH al servidor `fullstack.dcc.uchile.cl`
- Usuario: `fullstack`
- Puerto SSH: `219`
- Puerto de la aplicación: `7112` 
- Proyecto local compilado y funcional

## Estructura del Proyecto en el Servidor

```
fullstackAnakena/
├── backend/
│   ├── src/
│   ├── dist/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── dist/
│   └── package.json
└── e2etest/
```

## Pasos para Deploy

### 1. Compilar Backend y Frontend

Desde la carpeta `backend/`:

```bash
cd backend
npm run build:ui
```

Este comando compila el frontend, compila el backend y copia los archivos estáticos del frontend al backend.

### 2. Subir Backend al Servidor

Desde la carpeta `backend/`:

```bash
scp -P 219 -r . fullstack@fullstack.dcc.uchile.cl:fullstackAnakena/backend/
```

O desde la raíz del proyecto:

```bash
scp -P 219 -r backend fullstack@fullstack.dcc.uchile.cl:fullstackAnakena/
```

### 3. Conectarse al Servidor via SSH

```bash
ssh -p 219 fullstack@fullstack.dcc.uchile.cl
```

### 4. Instalar Dependencias en el Servidor

Una vez conectado al servidor:

```bash
cd fullstackAnakena/backend
npm install 
```

### 5. Configurar Variables de Entorno

Es necesario verificar que el archivo `.env` exista en el backend:

```bash
cd fullstackAnakena/backend
cat .env
```

Contenido:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/anakena
JWT_SECRET=tu_secreto_super_seguro
NODE_ENV=production
```

### 6. Iniciar/Reiniciar el Backend

```bash
cd fullstackAnakena/backend
npm run start
```

## Acceso a la Aplicación

Una vez desplegada, la aplicación estará disponible en:

**https://fullstack.dcc.uchile.cl:7112**
