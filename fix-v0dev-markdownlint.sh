#!/bin/bash

echo "🔧 Corrigiendo errores de markdownlint en V0Dev..."

# Función para corregir headings sin líneas en blanco (MD022)
fix_headings() {
    echo "📝 Corrigiendo headings sin líneas en blanco..."
    
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Crear archivo temporal
        temp_file=$(mktemp)
        
        # Procesar el archivo línea por línea
        awk '
        BEGIN { prev_line_empty = 1 }
        {
            # Si es un heading (empieza con #)
            if (/^#{1,6}/) {
                # Si la línea anterior no está vacía, agregar línea en blanco
                if (!prev_line_empty) {
                    print ""
                }
                print $0
                prev_line_empty = 0
            }
            # Si es una línea vacía
            else if (/^$/) {
                print $0
                prev_line_empty = 1
            }
            # Si es contenido normal
            else {
                print $0
                prev_line_empty = 0
            }
        }
        ' "$file" > "$temp_file"
        
        # Reemplazar archivo original
        mv "$temp_file" "$file"
    done
}

# Función para corregir listas sin líneas en blanco (MD032)
fix_lists() {
    echo "📋 Corrigiendo listas sin líneas en blanco..."
    
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Crear archivo temporal
        temp_file=$(mktemp)
        
        # Procesar el archivo línea por línea
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
                print $0
                prev_line_empty = 0
            }
        }
        ' "$file" > "$temp_file"
        
        # Reemplazar archivo original
        mv "$temp_file" "$file"
    done
}

# Función para corregir líneas largas (MD013)
fix_line_length() {
    echo "📏 Dividiendo líneas largas..."
    
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Crear archivo temporal
        temp_file=$(mktemp)
        
        # Procesar línea por línea
        while IFS= read -r line; do
            # Si la línea es muy larga (>180 caracteres) y no es código
            if [[ ${#line} -gt 180 && ! "$line" =~ ^[[:space:]]*``` ]]; then
                # Dividir la línea en palabras
                words=($line)
                current_line=""
                
                for word in "${words[@]}"; do
                    # Si agregar esta palabra excede el límite
                    if [[ ${#current_line}${#word} -gt 160 ]]; then
                        echo "$current_line" >> "$temp_file"
                        current_line="$word"
                    else
                        if [[ -z "$current_line" ]]; then
                            current_line="$word"
                        else
                            current_line="$current_line $word"
                        fi
                    fi
                done
                
                # Imprimir la última línea
                if [[ -n "$current_line" ]]; then
                    echo "$current_line" >> "$temp_file"
                fi
            else
                echo "$line" >> "$temp_file"
            fi
        done < "$file"
        
        # Reemplazar archivo original
        mv "$temp_file" "$file"
    done
}

# Función para limpiar líneas en blanco múltiples (MD012)
clean_multiple_blanks() {
    echo "🧹 Limpiando líneas en blanco múltiples..."
    
    find frontend/V0Dev -name "*.md" -type f -exec sed -i '' '/^$/N;/^\n$/D' {} \;
}

# Función para limpiar espacios al final (MD009)
clean_trailing_spaces() {
    echo "🧽 Limpiando espacios al final..."
    
    find frontend/V0Dev -name "*.md" -type f -exec sed -i '' 's/[[:space:]]*$//' {} \;
}

# Ejecutar todas las correcciones
fix_headings
fix_lists
fix_line_length
clean_multiple_blanks
clean_trailing_spaces

echo "✅ Correcciones completadas!"
echo "🔍 Verificando errores restantes..."

# Verificar errores restantes
markdownlint frontend/V0Dev/ 2>/dev/null || {
    echo "⚠️ Algunos errores persisten (revisar manualmente)"
}

echo "🎯 Proceso completado!"
