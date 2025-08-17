#!/bin/bash

echo "🔧 Corrigiendo errores de markdownlint en V0Dev..."

# Corregir headings sin líneas en blanco
echo "📝 Corrigiendo headings sin líneas en blanco..."
find frontend/V0Dev -name "*.md" -type f -exec sed -i '' 's/^### \(.*\)$/\
### \1\
/' {} \;

# Corregir listas sin líneas en blanco
echo "📋 Corrigiendo listas sin líneas en blanco..."
find frontend/V0Dev -name "*.md" -type f -exec sed -i '' 's/^- \(.*\)$/\
- \1\
/' {} \;

# Corregir líneas largas (dividir en 160 caracteres)
echo "📏 Dividiendo líneas largas..."
find frontend/V0Dev -name "*.md" -type f -exec sed -i '' 's/\(.\{160\}\)/\1\
/g' {} \;

echo "✅ Correcciones completadas!"
echo "🔍 Verificando errores restantes..."

# Verificar errores restantes
markdownlint frontend/V0Dev/ 2>/dev/null || {
    echo "⚠️ Algunos errores persisten (revisar manualmente)"
}

echo "🎯 Proceso completado!"
