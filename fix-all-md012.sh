#!/bin/bash

echo "🚀 Corrigiendo TODOS los errores MD012 en todo el proyecto de manera AGRESIVA..."

# Función para corregir líneas en blanco múltiples de manera ultra-agresiva
fix_multiple_blanks_ultra_aggressive() {
    local file="$1"
    echo "Procesando: $file"
    
    # Crear archivo temporal
    local temp_file=$(mktemp)
    
    # Usar sed para eliminar TODAS las líneas en blanco múltiples de manera más agresiva
    # Primero, reemplazar múltiples líneas en blanco con una sola
    sed '/^$/N;/^\n$/D' "$file" > "$temp_file"
    
    # Luego, usar awk para asegurar que solo haya una línea en blanco
    awk '
    BEGIN { 
        prev_line_empty = 0 
    }
    {
        current_line = $0
        
        # Si es una línea vacía
        if (current_line == "") {
            # Solo imprimir si la línea anterior no estaba vacía
            if (!prev_line_empty) {
                print current_line
            }
            prev_line_empty = 1
        }
        # Si es contenido normal
        else {
            print current_line
            prev_line_empty = 0
        }
    }
    ' "$temp_file" > "$file"
    
    # Limpiar archivo temporal
    rm "$temp_file"
    echo "✅ $file corregido de manera ultra-agresiva"
}

# Buscar TODOS los archivos markdown en el proyecto
echo "🔍 Buscando archivos markdown..."
files=$(find docs -name "*.md" -type f)

# Contador de archivos procesados
count=0

# Corregir cada archivo
for file in $files; do
    if [ -f "$file" ]; then
        fix_multiple_blanks_ultra_aggressive "$file"
        ((count++))
    fi
done

echo "✅ Corrección ULTRA-AGRESIVA de MD012 completada!"
echo "📊 Total de archivos procesados: $count"
echo "🔍 Verificando errores restantes..."

# Verificar errores restantes
errors=$(markdownlint "docs/**/*.md" --config .markdownlint.json 2>/dev/null | grep "MD012" | wc -l)

if [ "$errors" -eq 0 ]; then
    echo "🎉 ¡PERFECTO! No hay errores MD012 restantes"
else
    echo "⚠️ Aún hay $errors errores MD012 restantes"
    echo "🔍 Mostrando errores restantes:"
    markdownlint "docs/**/*.md" --config .markdownlint.json 2>/dev/null | grep "MD012" | head -10
fi

echo "🎯 Proceso completado!"
