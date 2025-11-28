#!/bin/bash

# Script para iniciar el servidor en screen
# Uso: ./start-server.sh

echo "Iniciando servidor Anakena en screen..."

# Verificar si screen está instalado
if ! command -v screen &> /dev/null; then
    echo "Error: screen no está instalado. Instálalo con: sudo apt-get install screen"
    exit 1
fi

# Matar sesiones anteriores si existen
screen -S anakena-backend -X quit 2>/dev/null
echo "Sesión anterior de backend cerrada (si existía)"

# Crear sesión de screen para el backend
screen -dmS anakena-backend bash -c "cd backend && npm start; exec bash"
echo "✓ Backend iniciado en screen 'anakena-backend'"

# Esperar un momento para que el backend inicie
sleep 2

# Mostrar instrucciones
echo ""
echo "=========================================="
echo "Servidor iniciado exitosamente!"
echo "=========================================="
echo ""
echo "Para ver el backend ejecutándose:"
echo "  screen -r anakena-backend"
echo ""
echo "Para salir de screen sin cerrar el proceso:"
echo "  Presiona Ctrl+A, luego D"
echo ""
echo "Para ver todas las sesiones de screen:"
echo "  screen -ls"
echo ""
echo "Para detener el servidor:"
echo "  ./stop-server.sh"
echo ""
