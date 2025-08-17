#!/bin/bash

echo "🔧 Corrigiendo errores de markdownlint en V0Dev..."

# Función para corregir errores MD022 (headings sin líneas en blanco)
fix_headings() {
    echo "📝 Corrigiendo headings sin líneas en blanco..."
    
    # Buscar archivos markdown en V0Dev
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
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
    
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
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
        
        # Reemplazar archivo original
        mv "$temp_file" "$file"
    done
}

# Función para corregir errores MD013 (líneas largas)
fix_line_length() {
    echo "📏 Dividiendo líneas largas..."
    
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
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

# Función para corregir errores MD036 (énfasis como heading)
fix_emphasis_heading() {
    echo "🔤 Corrigiendo énfasis usado como heading..."
    
    find frontend/V0Dev -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Reemplazar líneas que usan ** como heading con # apropiado
        sed -i '' 's/^\*\*\([^*]*\)\*\*$/# \1/' "$file"
    done
}

# Ejecutar todas las correcciones
fix_headings
fix_lists
fix_line_length
fix_emphasis_heading

echo "✅ Correcciones completadas!"
echo "🔍 Verificando errores restantes..."

# Verificar errores restantes
markdownlint frontend/V0Dev/ 2>/dev/null || {
    echo "⚠️ Algunos errores persisten (revisar manualmente)"
}

echo "🎯 Proceso completado!"
