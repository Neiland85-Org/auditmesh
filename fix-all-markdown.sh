#!/bin/bash

echo "🚀 Corrigiendo TODOS los errores de markdownlint de una vez..."

# Función para corregir todos los errores comunes
fix_all_errors() {
    echo "🔧 Aplicando correcciones masivas..."
    
    find docs -name "*.md" -type f | while read -r file; do
        echo "Procesando: $file"
        
        # Crear archivo temporal
        temp_file=$(mktemp)
        
        # Procesar el archivo con múltiples correcciones
        awk '
        BEGIN { 
            in_heading = 0; 
            in_list = 0; 
            prev_line_empty = 1;
            prev_line = "";
            consecutive_blanks = 0;
        }
        {
            current_line = $0
            
            # Eliminar espacios al final
            gsub(/[[:space:]]+$/, "", current_line)
            
            # Si es una línea vacía
            if (current_line == "") {
                consecutive_blanks++
                # Solo mantener una línea en blanco
                if (consecutive_blanks <= 1) {
                    print current_line
                }
                in_heading = 0
                in_list = 0
                prev_line_empty = 1
            }
            # Si es un heading (empieza con #)
            else if (/^#{1,6}/) {
                consecutive_blanks = 0
                
                # Agregar línea en blanco antes si la línea anterior no está vacía
                if (!prev_line_empty) {
                    print ""
                }
                
                print current_line
                
                # Agregar línea en blanco después
                print ""
                
                in_heading = 1
                in_list = 0
                prev_line_empty = 1
            }
            # Si es una lista (empieza con - o *)
            else if (/^[[:space:]]*[-*]/) {
                consecutive_blanks = 0
                
                # Agregar línea en blanco antes si la línea anterior no está vacía
                if (!prev_line_empty) {
                    print ""
                }
                
                print current_line
                
                in_heading = 0
                in_list = 1
                prev_line_empty = 0
            }
            # Si es contenido normal
            else {
                consecutive_blanks = 0
                
                # Si estábamos en un heading o lista, agregar línea en blanco
                if (in_heading || in_list) {
                    print ""
                    in_heading = 0
                    in_list = 0
                }
                
                print current_line
                prev_line_empty = 0
            }
            
            prev_line = current_line
        }
        END {
            # Si terminamos en un heading o lista, agregar línea en blanco
            if (in_heading || in_list) {
                print ""
            }
        }
        ' "$file" > "$temp_file"
        
        # Reemplazar archivo original
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

# Ejecutar todas las correcciones
fix_all_errors
fix_line_length

echo "✅ Todas las correcciones completadas!"
echo "🔍 Verificando errores finales..."

# Verificar errores restantes
markdownlint "docs/**/*.md" --config .markdownlint.json || echo "⚠️ Algunos errores persisten (revisar manualmente)"

echo "🎯 Proceso completado!"
echo "📊 Resumen de correcciones aplicadas:"
echo "   - Headings con líneas en blanco (MD022)"
echo "   - Listas con líneas en blanco (MD032)"
echo "   - Espacios al final de líneas (MD009)"
echo "   - Líneas en blanco múltiples (MD012)"
echo "   - Líneas largas divididas (MD013)"
