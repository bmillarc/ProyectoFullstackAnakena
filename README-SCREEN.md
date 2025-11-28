# Guía de uso de Screen para el servidor Anakena

## Scripts disponibles

### 1. Iniciar el servidor
```bash
./start-server.sh
```
Inicia el backend en una sesión de screen llamada `anakena-backend`.

### 2. Detener el servidor
```bash
./stop-server.sh
```
Detiene todas las sesiones de screen del servidor.

### 3. Ver estado del servidor
```bash
./status-server.sh
```
Muestra qué componentes están corriendo.

## Comandos de Screen útiles

### Ver sesiones activas
```bash
screen -ls
```

### Conectarse a una sesión
```bash
screen -r anakena-backend
```

### Desconectarse sin cerrar (dentro de screen)
Presiona: `Ctrl+A`, luego `D`

### Cerrar una sesión (dentro de screen)
```bash
exit
```
o presiona `Ctrl+D`

### Matar una sesión desde fuera
```bash
screen -S anakena-backend -X quit
```

## Flujo de trabajo típico

### En el servidor (primera vez)
```bash
# Dar permisos de ejecución a los scripts
chmod +x start-server.sh stop-server.sh status-server.sh

# Iniciar el servidor
./start-server.sh
```

### Desconectarse del servidor SSH
```bash
exit
```
El servidor seguirá corriendo en screen.

### Reconectarse y ver logs
```bash
# Conectarse por SSH
ssh fullstack@fullstack.dcc.uchile.cl -p 219

# Ver el backend
screen -r anakena-backend

# Salir de screen sin cerrar (Ctrl+A, luego D)
```

### Actualizar el código
```bash
# Detener el servidor
./stop-server.sh

# Actualizar tu código (ej: git pull o scp)
# ...

# Reconstruir si es necesario
cd backend && npm run build && cd ..

# Reiniciar
./start-server.sh
```

## Notas importantes

1. **El frontend está servido por el backend**: No necesitas una sesión separada para el frontend, el backend sirve los archivos estáticos.

2. **Logs persistentes**: Los logs se muestran en tiempo real dentro de screen. Para guardar logs en un archivo, modifica `start-server.sh`.

3. **Variables de entorno**: Asegúrate de que el archivo `.env` esté en la carpeta `backend/` antes de iniciar.

4. **Puerto**: El servidor corre en el puerto configurado en tu `.env` (por defecto 3000).

## Solución de problemas

### Screen no está instalado
```bash
sudo apt-get update
sudo apt-get install screen
```

### El puerto ya está en uso
```bash
# Ver qué proceso usa el puerto (ej: 3000)
lsof -i :3000

# Matar el proceso si es necesario
kill -9 <PID>
```

### Ver todos los procesos node corriendo
```bash
ps aux | grep node
```
