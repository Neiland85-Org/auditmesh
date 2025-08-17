# AuditMesh Frontend - Docker Setup

Este documento describe cómo construir y ejecutar el frontend de AuditMesh usando Docker.

## 🐳 Configuración Docker

### Estructura de Archivos

```
frontend/
├── Dockerfile              # Multi-stage build optimizado
├── nginx.conf              # Configuración de nginx para SPA
├── docker-compose.yml      # Compose independiente del frontend
├── build.sh                # Script de build automatizado
├── env.example             # Variables de entorno de ejemplo
└── DOCKER.md               # Esta documentación
```

## 🚀 Inicio Rápido

### 1. Build y Ejecución Independiente

```bash
# Construir la imagen Docker
./build.sh build

# Ejecutar el frontend
./build.sh run

# El frontend estará disponible en: http://localhost:5173
```

### 2. Integración con Backend Completo

```bash
# Desde el directorio raíz del proyecto
docker-compose up -d

# Esto iniciará todos los servicios incluyendo el frontend
```

## 📋 Comandos Disponibles

### Script de Build (`build.sh`)

| Comando | Descripción |
|---------|-------------|
| `./build.sh build` | Construir la imagen Docker |
| `./build.sh run` | Construir y ejecutar |
| `./build.sh start` | Iniciar contenedor existente |
| `./build.sh stop` | Detener contenedor |
| `./build.sh restart` | Reiniciar contenedor |
| `./build.sh logs` | Mostrar logs en tiempo real |
| `./build.sh status` | Estado del contenedor |
| `./build.sh clean` | Limpiar imágenes Docker |
| `./build.sh help` | Mostrar ayuda |

### Docker Compose

```bash
# Iniciar solo el frontend
cd frontend
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🔧 Configuración

### Variables de Entorno

Copia `env.example` a `.env.local` y ajusta según tu entorno:

```bash
# API Endpoints
VITE_API_BASE_URL=http://localhost:3000
VITE_GATEWAY_URL=http://localhost:3000
VITE_DETECTOR_URL=http://localhost:3001
VITE_AUDITOR_URL=http://localhost:3002

# Servicios Externos
VITE_REDPANDA_CONSOLE_URL=http://localhost:8080
VITE_JAEGER_URL=http://localhost:16686
VITE_MINIO_URL=http://localhost:9001
```

### Puertos

- **Frontend**: 5173 (exterior) → 80 (interior)
- **Gateway**: 3000
- **Detector**: 3001
- **Auditor**: 3002

## 🏗️ Arquitectura Docker

### Multi-Stage Build

1. **Dependencies Stage**: Instala dependencias de producción
2. **Build Stage**: Construye la aplicación React
3. **Runtime Stage**: Nginx optimizado para SPA

### Características de Seguridad

- Usuario no-root (nextjs:1001)
- Headers de seguridad configurados
- Health checks integrados
- Logs estructurados

### Optimizaciones de Rendimiento

- Compresión Gzip habilitada
- Cache de assets estáticos
- Nginx optimizado para SPA
- Build optimizado con Vite

## 🔍 Monitoreo y Debugging

### Health Check

```bash
# Verificar estado del contenedor
curl http://localhost:5173/health

# Ver logs del contenedor
./build.sh logs
```

### Troubleshooting

#### Problema: Contenedor no inicia
```bash
# Ver logs detallados
docker logs auditmesh-frontend

# Verificar configuración
docker inspect auditmesh-frontend
```

#### Problema: Puerto ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3000:80"  # Cambiar 3000 por puerto libre
```

#### Problema: Build falla
```bash
# Limpiar cache de Docker
docker system prune -a

# Reconstruir sin cache
docker build --no-cache -t auditmesh-frontend .
```

## 🌐 Redes Docker

### Redes Disponibles

- **auditmesh-network**: Red principal del proyecto
- **frontend-network**: Red independiente del frontend

### Comunicación entre Servicios

```yaml
# En docker-compose principal
environment:
  - VITE_API_BASE_URL=http://ms-gateway:3000
  - VITE_GATEWAY_URL=http://ms-gateway:3000
  - VITE_DETECTOR_URL=http://ms-lie-detector:3001
  - VITE_AUDITOR_URL=http://ms-auditor:3002
```

## 📦 Despliegue

### Producción

```bash
# Build para producción
docker build --target runtime -t auditmesh-frontend:prod .

# Ejecutar en producción
docker run -d \
  --name auditmesh-frontend-prod \
  -p 80:80 \
  --restart unless-stopped \
  auditmesh-frontend:prod
```

### Desarrollo

```bash
# Build para desarrollo
docker build --target build -t auditmesh-frontend:dev .

# Ejecutar con hot reload
docker run -d \
  --name auditmesh-frontend-dev \
  -p 5173:80 \
  -v $(pwd)/src:/app/src \
  auditmesh-frontend:dev
```

## 🔗 Enlaces Útiles

- **Frontend**: http://localhost:5173
- **Gateway API**: http://localhost:3000
- **Detector API**: http://localhost:3001
- **Auditor API**: http://localhost:3002
- **Redpanda Console**: http://localhost:8080
- **Jaeger**: http://localhost:16686
- **MinIO**: http://localhost:9001

## 📚 Recursos Adicionales

- [Docker Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
