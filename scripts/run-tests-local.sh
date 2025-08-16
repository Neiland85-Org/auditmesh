#!/bin/bash

# 🧪 AuditMesh Local Testing Suite
# Script para ejecutar tests sin Docker (solo tests unitarios)

set -e  # Exit on any error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para ejecutar tests de un servicio
run_service_tests() {
    local service=$1
    local service_dir="services/$service"
    
    print_status "Ejecutando tests de $service..."
    
    if [ ! -d "$service_dir" ]; then
        print_error "Directorio $service_dir no encontrado"
        return 1
    fi
    
    cd "$service_dir"
    
    # Verificar si package.json tiene scripts de test
    if ! grep -q '"test"' package.json; then
        print_warning "$service no tiene scripts de test configurados"
        cd - > /dev/null
        return 0
    fi
    
    # Instalar dependencias si es necesario
    if [ ! -d "node_modules" ]; then
        print_status "Instalando dependencias de $service..."
        npm install
    fi
    
    # Ejecutar tests unitarios (mocked)
    print_status "Ejecutando tests unitarios de $service..."
    
    # Buscar archivos de test que no sean .simple.test.js
    local test_files=$(find __tests__ -name "*.test.js" ! -name "*.simple.test.js" 2>/dev/null || true)
    
    if [ -n "$test_files" ]; then
        if npm test; then
            print_success "Tests unitarios de $service completados exitosamente"
        else
            print_error "Tests unitarios de $service fallaron"
            cd - > /dev/null
            return 1
        fi
    else
        print_warning "No se encontraron tests unitarios en $service"
    fi
    
    cd - > /dev/null
}

# Función para generar reporte de coverage
generate_coverage_report() {
    print_status "Generando reporte de coverage..."
    
    local services_tested=0
    
    for service in ms-gateway ms-lie-detector ms-auditor; do
        local service_dir="services/$service"
        if [ -d "$service_dir" ] && [ -f "$service_dir/package.json" ]; then
            cd "$service_dir"
            
            if grep -q '"test:coverage"' package.json; then
                print_status "Generando coverage para $service..."
                if npm run test:coverage > /dev/null 2>&1; then
                    if [ -f "coverage/lcov-report/index.html" ]; then
                        print_success "Coverage de $service generado"
                        services_tested=$((services_tested + 1))
                    fi
                fi
            fi
            
            cd - > /dev/null
        fi
    done
    
    if [ $services_tested -gt 0 ]; then
        print_success "Reportes de coverage generados para $services_tested servicios"
        print_status "Abre coverage/lcov-report/index.html en cada servicio para ver detalles"
    fi
}

# Función principal
main() {
    echo -e "${BLUE}"
    echo "🧪 ========================================"
    echo "   AuditMesh Local Testing Suite"
    echo "======================================== 🧪"
    echo -e "${NC}"
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "docker-compose.yml" ]; then
        print_error "Este script debe ejecutarse desde la raíz del proyecto AuditMesh"
        exit 1
    fi
    
    print_status "Ejecutando tests unitarios (sin Docker)..."
    
    # Ejecutar tests de cada servicio
    local failed_services=()
    
    for service in ms-gateway ms-lie-detector ms-auditor; do
        if ! run_service_tests "$service"; then
            failed_services+=("$service")
        fi
    done
    
    # Generar reporte de coverage
    generate_coverage_report
    
    # Resumen final
    echo
    echo -e "${BLUE}========================================"
    echo "           RESUMEN DE TESTS LOCALES"
    echo "========================================"
    echo -e "${NC}"
    
    if [ ${#failed_services[@]} -eq 0 ]; then
        print_success "🎉 TODOS LOS TESTS UNITARIOS PASARON EXITOSAMENTE!"
        print_success "✅ Gateway Service - OK"
        print_success "✅ Lie Detector Service - OK"
        print_success "✅ Auditor Service - OK"
    else
        print_error "❌ ALGUNOS TESTS FALLARON:"
        for service in "${failed_services[@]}"; do
            print_error "   - $service"
        done
        exit 1
    fi
    
    echo
    print_warning "⚠️  NOTA: Estos son solo tests unitarios (mocked)"
    print_warning "   Para tests de integración completos, ejecuta: ./scripts/run-tests.sh"
    echo
    print_status "Para ver reportes de coverage:"
    echo "   open services/ms-gateway/coverage/lcov-report/index.html"
    echo "   open services/ms-lie-detector/coverage/lcov-report/index.html"
    echo "   open services/ms-auditor/coverage/lcov-report/index.html"
}

# Ejecutar función principal
main "$@"
