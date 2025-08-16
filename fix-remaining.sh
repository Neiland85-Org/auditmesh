#!/bin/bash

echo "🔧 Corrigiendo errores restantes de markdownlint..."

# Función para corregir espacios al final de líneas (MD009)
fix_trailing_spaces() {
    echo "🧹 Corrigiendo espacios al final de líneas..."
    
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Usar sed para eliminar espacios al final de líneas
        sed -i 's/[[:space:]]*$//' "$file"
    done
}

# Función para corregir líneas en blanco múltiples (MD012)
fix_multiple_blanks() {
    echo "📝 Corrigiendo líneas en blanco múltiples..."
    
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Usar sed para reemplazar múltiples líneas en blanco con una sola
        sed -i '/^$/N;/^\n$/D' "$file"
    done
}

# Función para corregir headings sin líneas en blanco restantes
fix_remaining_headings() {
    echo "📋 Corrigiendo headings restantes sin líneas en blanco..."
    
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        temp_file=$(mktemp)
        
        awk '
        {
            # Si es un heading (empieza con #)
            if (/^#{1,6}/) {
                # Agregar línea en blanco antes si la línea anterior no está vacía
                if (NR > 1 && prev_line != "") {
                    print ""
                }
                print $0
                # Agregar línea en blanco después
                print ""
            }
            # Si es una línea vacía, no duplicar
            else if (/^$/) {
                if (prev_line != "") {
                    print $0
                }
            }
            # Si es contenido normal
            else {
                print $0
            }
            prev_line = $0
        }
        ' "$file" > "$temp_file"
        
        mv "$temp_file" "$file"
    done
}

# Ejecutar correcciones
fix_trailing_spaces
fix_multiple_blanks
fix_remaining_headings

echo "✅ Correcciones adicionales completadas!"
echo "🔍 Verificando errores finales..."

# Verificar errores restantes
markdownlint "docs/**/*.md" --config .markdownlint.json || echo "⚠️ Algunos errores persisten (revisar manualmente)"

echo "🎯 Proceso completado!"
