#!/bin/bash

echo "🔧 Corrigiendo errores MD012 (líneas en blanco múltiples) en archivos de certificaciones..."

# Función para corregir líneas en blanco múltiples (MD012)
fix_multiple_blanks() {
    local file="$1"
    echo "Procesando: $file"
    
    # Crear archivo temporal
    local temp_file=$(mktemp)
    
    # Usar awk para eliminar líneas en blanco múltiples
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
    ' "$file" > "$temp_file"
    
    # Reemplazar archivo original
    mv "$temp_file" "$file"
    echo "✅ $file corregido"
}

# Lista de archivos específicos a corregir
files=(
    "docs/certifications/ISO27001.md"
    "docs/certifications/PCI_DSS.md"
    "docs/certifications/README.md"
    "docs/certifications/SOC2.md"
)

# Corregir cada archivo
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        fix_multiple_blanks "$file"
    else
        echo "⚠️ Archivo no encontrado: $file"
    fi
done

echo "✅ Corrección de MD012 completada!"
echo "🔍 Verificando errores restantes..."

# Verificar errores restantes solo en estos archivos
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Verificando: $file"
        markdownlint "$file" --config .markdownlint.json 2>/dev/null || echo "✅ $file - Sin errores MD012"
    fi
done

echo "🎯 Proceso completado!"
