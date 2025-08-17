# 🧪 Testing Guide - AuditMesh

## 📋 **Resumen Ejecutivo**

AuditMesh implementa un sistema de testing completo y robusto que cubre todos los microservicios con tests unitarios,
de integración y E2E. El sistema garantiza la calidad del código y la funcionalidad del flujo completo de auditoría.

## 🏗️ **Arquitectura de Testing**

```bash
auditmesh/
├── services/
│   ├── ms-gateway/
│   │   ├── __tests__/
│   │   │   ├── gateway.test.js          # Tests completos (mocked)
│   │   │   └── gateway.simple.test.js   # Tests de integración
│   │   └── package.json                 # Configuración Jest
│   ├── ms-lie-detector/
│   │   ├── __tests__/
│   │   │   ├── lie-detector.test.js     # Tests completos (mocked)
│   │   │   └── lie-detector.simple.test.js # Tests de integración
│   │   └── package.json                 # Configuración Jest
│   └── ms-auditor/
│       ├── __tests__/
│       │   └── auditor.test.js          # Tests completos (mocked)
│       └── package.json                 # Configuración Jest
└── docs/
    └── TESTING.md                       # Esta documentación
```

## 🚀 **Configuración de Testing**

### **Dependencias Instaladas**

Cada servicio incluye las siguientes dependencias de testing:

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2"
  }
}
```

### **Configuración Jest**

```json
{
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "**/*.js",
      "!**/node_modules/**",
      "!**/coverage/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 📊 **Cobertura de Tests**

### **1. Gateway Service (ms-gateway)**

#### **Gateway Endpoints:**

- ✅ `GET /health` - Health check

- ✅ `GET /` - Información del servicio

- ✅ `POST /events` - Procesamiento de eventos

#### **Casos de Test:**

- **Health Check:** Verificación de estado saludable

- **Service Info:** Información del servicio y versión

- **Event Processing:**

  - Eventos válidos (200)

  - Eventos inválidos (400)

  - Manejo de errores (500)

- **Integration:** Comunicación con Lie Detector y Auditor

#### **Tests Implementados - Gateway:**

```bash

# Tests de integración (contra servicio real)

npm test -- __tests__/gateway.simple.test.js

# Tests completos (mocked)

npm test -- __tests__/gateway.test.js
```

### **2. Lie Detector Service (ms-lie-detector)**

#### **Lie Detector Endpoints:**

- ✅ `GET /health` - Health check

- ✅ `GET /` - Información del servicio

- ✅ `POST /analyze` - Análisis de eventos

#### **Casos de Test - Lie Detector:**

- **Health Check:** Verificación de estado saludable

- **Service Info:** Información del servicio y versión

- **Event Analysis:**

  - Análisis de IPs internas (riesgo MEDIO)

  - Detección de IPs inválidas (riesgo ALTO)

  - Detección de user-agents de bot (riesgo ALTO)

  - Eventos con timestamps antiguos (riesgo MEDIO)

  - Eventos normales (riesgo BAJO)

- **Risk Classification:**

  - LOW (0-24 puntos)

  - MEDIUM (25-49 puntos)

  - HIGH (50+ puntos)

- **Validation:** Campos requeridos (eventId, type)

#### **Tests Implementados - Lie Detector:**

```bash

# Tests de integración (contra servicio real)

npm test -- __tests__/lie-detector.simple.test.js

# Tests completos (mocked)

npm test -- __tests__/lie-detector.test.js
```

### **3. Auditor Service (ms-auditor)**

#### **Auditor Endpoints:**

- ✅ `GET /health` - Health check

- ✅ `GET /` - Información del servicio

- ✅ `POST /audit` - Creación de registros de auditoría

#### **Casos de Test - Auditor:**

- **Health Check:** Verificación de estado saludable

- **Service Info:** Información del servicio y versión

- **Audit Creation:**

  - Creación exitosa de registros de auditoría

  - IDs únicos para cada registro

  - Trazabilidad completa del flujo

  - Evaluación de cumplimiento (GDPR, SOX, PCI, HIPAA)

  - Evaluación de riesgos y escalación

  - Recomendaciones automáticas

- **Validation:** Campos requeridos (eventId, analysis, originalEvent)

- **Error Handling:** Manejo de datos inválidos

- **Performance:** Tests de concurrencia

#### **Tests Implementados - Auditor:**

```bash

# Tests completos (mocked)

npm test -- __tests__/auditor.test.js

# Tests de integración (contra servicio real)

npm test -- __tests__/auditor.simple.test.js

# Tests de performance

npm test -- __tests__/auditor.performance.test.js
```

## 🎯 **Tipos de Tests Implementados**

### **1. Unit Tests**

- **Objetivo:** Probar funciones individuales en aislamiento

- **Cobertura:** Lógica de negocio, validaciones, cálculos

- **Herramientas:** Jest (mocking, assertions)

### **2. Integration Tests**

- **Objetivo:** Probar comunicación entre servicios

- **Cobertura:** APIs, endpoints, flujos de datos

- **Herramientas:** Supertest, servicios Docker reales

### **3. E2E Tests**

- **Objetivo:** Probar el flujo completo del sistema

- **Cobertura:** Gateway → Lie Detector → Auditor

- **Herramientas:** Supertest, flujo completo real

## 🚀 **Ejecución de Tests**

### **Comandos Principales**

```bash

# Desde la raíz del proyecto

cd services/ms-gateway && npm test
cd services/ms-lie-detector && npm test
cd services/ms-auditor && npm test

# Tests específicos

npm test -- __tests__/gateway.simple.test.js
npm test -- __tests__/lie-detector.simple.test.js
npm test -- __tests__/auditor.test.js

# Tests con watch mode

npm run test:watch

# Tests con coverage

npm run test:coverage

# Tests para CI/CD

npm run test:ci
```

### **Ejecución en Paralelo**

```bash

# Ejecutar todos los tests en paralelo

cd services && \
  (cd ms-gateway && npm test &) && \
  (cd ms-lie-detector && npm test &) && \
  (cd ms-auditor && npm test &) && \
  wait
```

## 📈 **Métricas de Calidad**

### **Cobertura Mínima Requerida**

- **Branches:** 80%

- **Functions:** 80%

- **Lines:** 80%

- **Statements:** 80%

### **Reportes de Coverage**

```bash

# Generar reporte HTML

npm run test:coverage

# Ver en navegador

open coverage/lcov-report/index.html
```

## 🔧 **Configuración de Entorno**

### **Variables de Entorno para Testing**

```bash

# Entorno de testing

NODE_ENV=test
PORT=0  # Puerto aleatorio para tests
```

### **Docker Compose para Testing**

```bash

# Levantar servicios para testing

docker compose up -d

# Verificar estado

docker compose ps

# Ver logs

docker compose logs -f
```

## 🐛 **Debugging de Tests**

### **Logs Detallados**

```bash

# Tests con logs verbosos

npm test -- --verbose

# Tests con logs de Jest

npm test -- --verbose --detectOpenHandles
```

### **Tests Individuales**

```bash

# Ejecutar test específico

npm test -- --testNamePattern="should return healthy status"

# Ejecutar suite específica

npm test -- --testPathPattern="gateway"
```

## 📋 **Checklist de Testing**

### **Antes de Commit**

- [ ] Todos los tests pasan (`npm test`)

- [ ] Coverage mínimo alcanzado (80%)

- [ ] Tests de integración funcionan

- [ ] No hay tests pendientes o skip

### **Antes de Deploy**

- [ ] Tests de CI/CD pasan

- [ ] Tests E2E completos

- [ ] Performance tests aprobados

- [ ] Security tests aprobados

## 🚨 **Solución de Problemas Comunes**

### **1. Puerto en Uso**

```bash

# Error: EADDRINUSE

# Solución: Usar puerto 0 en tests o detener servicios

docker compose down
```

### **2. Tests de Integración Fallan**

```bash

# Verificar que servicios estén ejecutándose

docker compose ps
curl http://localhost:3000/health
```

### **3. Coverage Bajo**

```bash

# Identificar archivos sin coverage

npm run test:coverage

# Revisar reporte HTML generado

```

## 🔮 **Roadmap de Testing**

### **Fase 1: Implementado ✅**

- [x] Tests unitarios básicos

- [x] Tests de integración

- [x] Tests E2E básicos

- [x] Configuración Jest

- [x] Coverage mínimo 80%

### **Fase 2: En Desarrollo 🔄**

- [ ] Tests de performance

- [ ] Tests de seguridad

- [ ] Tests de carga

- [ ] Tests de resiliencia

### **Fase 3: Planificado 📋**

- [ ] Tests de UI (cuando se implemente frontend)

- [ ] Tests de API GraphQL

- [ ] Tests de base de datos

- [ ] Tests de mensajería (Kafka/Redpanda)

## 📚 **Recursos Adicionales**

### **Documentación Jest**

- [Jest Documentation](https://jestjs.io/docs/getting-started)

- [Supertest Documentation](https://github.com/visionmedia/supertest)

### **Mejores Prácticas**

- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

- [Node.js Testing](https://nodejs.org/en/docs/guides/testing-and-debugging/)

---

**AuditMesh Testing Team** 🧪

#### Última actualización: 2025-08-16

