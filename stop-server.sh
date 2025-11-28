#!/bin/bash

# Script para detener el servidor en screen
# Uso: ./stop-server.sh

echo "Deteniendo servidor Anakena..."

# Detener backend
if screen -list | grep -q "anakena-backend"; then
    screen -S anakena-backend -X quit
    echo "✓ Backend detenido"
else
    echo "○ Backend no estaba corriendo"
fi

echo ""
echo "Servidor detenido completamente"
