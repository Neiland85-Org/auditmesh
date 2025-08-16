#!/bin/bash

echo "🔧 Corrigiendo errores de markdownlint..."

# Función para corregir errores MD022 (headings sin líneas en blanco)
fix_headings() {
    echo "📝 Corrigiendo headings sin líneas en blanco..."
    
    # Buscar archivos markdown
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Crear archivo temporal
        temp_file=$(mktemp)
        
        # Procesar el archivo línea por línea
        awk '
        BEGIN { in_heading = 0; prev_line_empty = 1 }
        {
            # Si es un heading (empieza con #)
            if (/^#{1,6}/) {
                # Si la línea anterior no está vacía, agregar línea en blanco
                if (!prev_line_empty) {
                    print ""
                }
                print $0
                in_heading = 1
                prev_line_empty = 0
            }
            # Si es una línea vacía
            else if (/^$/) {
                print $0
                prev_line_empty = 1
                in_heading = 0
            }
            # Si es contenido normal
            else {
                # Si estábamos en un heading, agregar línea en blanco
                if (in_heading) {
                    print ""
                    in_heading = 0
                }
                print $0
                prev_line_empty = 0
            }
        }
        END {
            # Si terminamos en un heading, agregar línea en blanco
            if (in_heading) {
                print ""
            }
        }
        ' "$file" > "$temp_file"
        
        # Reemplazar archivo original
        mv "$temp_file" "$file"
    done
}

# Función para corregir errores MD032 (listas sin líneas en blanco)
fix_lists() {
    echo "📋 Corrigiendo listas sin líneas en blanco..."
    
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        temp_file=$(mktemp)
        
        awk '
        BEGIN { in_list = 0; prev_line_empty = 1 }
        {
            # Si es una lista (empieza con - o *)
            if (/^[[:space:]]*[-*]/) {
                # Si la línea anterior no está vacía, agregar línea en blanco
                if (!prev_line_empty) {
                    print ""
                }
                print $0
                in_list = 1
                prev_line_empty = 0
            }
            # Si es una línea vacía
            else if (/^$/) {
                print $0
                prev_line_empty = 1
                in_list = 0
            }
            # Si es contenido normal
            else {
                # Si estábamos en una lista, agregar línea en blanco
                if (in_list) {
                    print ""
                    in_list = 0
                }
                print $0
                prev_line_empty = 0
            }
        }
        END {
            # Si terminamos en una lista, agregar línea en blanco
            if (in_list) {
                print ""
            }
        }
        ' "$file" > "$temp_file"
        
        mv "$temp_file" "$file"
    done
}

# Función para dividir líneas largas
fix_line_length() {
    echo "📏 Dividiendo líneas largas..."
    
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        temp_file=$(mktemp)
        
        awk '
        {
            if (length($0) > 120) {
                # Dividir líneas largas en espacios
                line = $0
                while (length(line) > 120) {
                    # Buscar el último espacio antes del límite
                    split_pos = 120
                    while (split_pos > 0 && substr(line, split_pos, 1) != " ") {
                        split_pos--
                    }
                    
                    if (split_pos > 0) {
                        print substr(line, 1, split_pos)
                        line = substr(line, split_pos + 1)
                    } else {
                        # Si no hay espacio, dividir en el límite
                        print substr(line, 1, 120)
                        line = substr(line, 121)
                    }
                }
                if (length(line) > 0) {
                    print line
                }
            } else {
                print $0
            }
        }
        ' "$file" > "$temp_file"
        
        mv "$temp_file" "$file"
    done
}

# Ejecutar correcciones
fix_headings
fix_lists
fix_line_length

echo "✅ Correcciones completadas!"
echo "🔍 Verificando errores restantes..."

# Verificar errores restantes
markdownlint "docs/**/*.md" --config .markdownlint.json || echo "⚠️ Algunos errores persisten (revisar manualmente)"

echo "🎯 Proceso completado!"
