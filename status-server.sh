#!/bin/bash

# Script para verificar el estado del servidor
# Uso: ./status-server.sh

echo "Estado del servidor Anakena:"
echo "=========================================="

# Verificar backend
if screen -list | grep -q "anakena-backend"; then
    echo "✓ Backend: CORRIENDO (screen: anakena-backend)"
    echo "  Para ver logs: screen -r anakena-backend"
else
    echo "○ Backend: DETENIDO"
fi

echo ""
echo "Sesiones de screen activas:"
screen -ls | grep anakena || echo "  Ninguna sesión de Anakena activa"
echo ""
