#!/bin/bash

# 🧪 AuditMesh Testing Suite
# Script para ejecutar todos los tests de manera automatizada

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

# Función para verificar si Docker está ejecutándose
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker no está ejecutándose. Iniciando Docker..."
        open -a Docker
        sleep 30  # Esperar a que Docker se inicie
    fi
}

# Función para verificar servicios
check_services() {
    print_status "Verificando estado de servicios..."
    
    if ! docker compose ps | grep -q "Up"; then
        print_warning "Servicios no están ejecutándose. Iniciando..."
        docker compose up -d
        sleep 15  # Esperar a que los servicios se inicien
    fi
    
    # Verificar health de los servicios
    print_status "Verificando health de servicios..."
    
    # Gateway
    if curl -s http://localhost:3000/health > /dev/null; then
        print_success "Gateway (3000) - OK"
    else
        print_error "Gateway (3000) - FAILED"
        return 1
    fi
    
    # Lie Detector
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "Lie Detector (3001) - OK"
    else
        print_error "Lie Detector (3001) - FAILED"
        return 1
    fi
    
    # Auditor
    if curl -s http://localhost:3002/health > /dev/null; then
        print_success "Auditor (3002) - OK"
    else
        print_error "Auditor (3002) - FAILED"
        return 1
    fi
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
    
    # Ejecutar tests
    print_status "Ejecutando tests de $service..."
    if npm test; then
        print_success "Tests de $service completados exitosamente"
    else
        print_error "Tests de $service fallaron"
        cd - > /dev/null
        return 1
    fi
    
    cd - > /dev/null
}

# Función para ejecutar tests de integración
run_integration_tests() {
    print_status "Ejecutando tests de integración..."
    
    # Test del flujo E2E completo
    print_status "Probando flujo E2E: Gateway → Lie Detector → Auditor"
    
    local test_event='{
        "eventId": "integration_test_001",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
        "type": "integration_test",
        "data": {
            "userId": "test_user",
            "action": "test_action",
            "ipAddress": "192.168.1.100",
            "userAgent": "Mozilla/5.0 (Test Browser)",
            "location": "Test Location"
        },
        "metadata": {
            "source": "integration_test",
            "version": "1.0.0",
            "environment": "testing"
        }
    }'
    
    local response=$(curl -s -X POST http://localhost:3000/events \
        -H "Content-Type: application/json" \
        -d "$test_event")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "Flujo E2E completado exitosamente"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        print_error "Flujo E2E falló"
        echo "$response"
        return 1
    fi
}

# Función para generar reporte de coverage
generate_coverage_report() {
    print_status "Generando reporte de coverage..."
    
    local total_coverage=0
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
    echo "   AuditMesh Testing Suite"
    echo "======================================== 🧪"
    echo -e "${NC}"
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "docker-compose.yml" ]; then
        print_error "Este script debe ejecutarse desde la raíz del proyecto AuditMesh"
        exit 1
    fi
    
    # Verificar Docker
    check_docker
    
    # Verificar servicios
    if ! check_services; then
        print_error "No se pudieron verificar los servicios. Abortando tests."
        exit 1
    fi
    
    # Ejecutar tests de cada servicio
    local failed_services=()
    
    for service in ms-gateway ms-lie-detector ms-auditor; do
        if ! run_service_tests "$service"; then
            failed_services+=("$service")
        fi
    done
    
    # Ejecutar tests de integración
    if ! run_integration_tests; then
        print_error "Tests de integración fallaron"
        failed_services+=("integration")
    fi
    
    # Generar reporte de coverage
    generate_coverage_report
    
    # Resumen final
    echo
    echo -e "${BLUE}========================================"
    echo "           RESUMEN DE TESTS"
    echo "========================================"
    echo -e "${NC}"
    
    if [ ${#failed_services[@]} -eq 0 ]; then
        print_success "🎉 TODOS LOS TESTS PASARON EXITOSAMENTE!"
        print_success "✅ Gateway Service - OK"
        print_success "✅ Lie Detector Service - OK"
        print_success "✅ Auditor Service - OK"
        print_success "✅ Integration Tests - OK"
    else
        print_error "❌ ALGUNOS TESTS FALLARON:"
        for service in "${failed_services[@]}"; do
            print_error "   - $service"
        done
        exit 1
    fi
    
    echo
    print_status "Para ver reportes de coverage:"
    echo "   open services/ms-gateway/coverage/lcov-report/index.html"
    echo "   open services/ms-lie-detector/coverage/lcov-report/index.html"
    echo "   open services/ms-auditor/coverage/lcov-report/index.html"
}

# Ejecutar función principal
main "$@"
