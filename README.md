
# AuditMesh — Auditable EDA Microservices Stack

**EN** — Modern microservices stack with Node.js, Docker, and comprehensive CI/CD pipeline for GitHub Container Registry.  
**ES** — Stack de microservicios moderno con Node.js, Docker y pipeline CI/CD completo para GitHub Container Registry.

## 🏗️ Arquitectura

AuditMesh es una plataforma de microservicios diseñada para auditoría y detección de mentiras, construida con:

- **ms-gateway**: API Gateway (puerto 3000)
- **ms-lie-detector**: Servicio de detección de mentiras (puerto 3001)
- **ms-auditor**: Servicio de auditoría (puerto 3002)
- **Docker Compose**: Orquestación local
- **GitHub Container Registry**: Registro de imágenes
- **CI/CD Pipeline**: Automatización completa

## 🚀 Quickstart (Desarrollo Local)

### Prerrequisitos

```bash
# macOS
brew install git gh jq make docker

# Verificar Docker
docker --version
docker compose version
```

### Configuración del Repositorio

```bash
# Clonar y configurar
gh auth login
git clone https://github.com/Neiland85-Org/auditmesh.git
cd auditmesh

# Configurar Docker (si no está en PATH)
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
```

### Levantar Servicios

```bash
# Construir y levantar todos los servicios
docker compose up -d --build

# Verificar estado
docker compose ps

# Ver logs
docker compose logs -f
```

### Acceso a los Servicios

- **Gateway**: <http://localhost:3000>
- **Lie Detector**: <http://localhost:3001>
- **Auditor**: <http://localhost:3002>

## 🔧 CI/CD Pipeline

El proyecto incluye un pipeline CI/CD completo en `.github/workflows/ci.yml`:

- **Análisis de Calidad**: Lint, tests, SCA, SBOM
- **Construcción**: Imágenes Docker optimizadas
- **Publicación**: GitHub Container Registry (GHCR)
- **Seguridad**: Generación de SBOM y Provenance
- **Despliegue**: Automático en ramas main/develop

## 📁 Estructura del Proyecto

```bash
auditmesh/
├── .github/workflows/     # Pipelines CI/CD
├── services/              # Microservicios
│   ├── ms-gateway/       # API Gateway
│   ├── ms-lie-detector/  # Detección de mentiras
│   └── ms-auditor/       # Servicio de auditoría
├── docs/                  # Documentación y ADRs
├── docker-compose.yml     # Orquestación local
└── README.md             # Este archivo
```

## 🚀 Configuración

### Variables de Entorno

El sistema utiliza variables de entorno para configurar la conectividad entre servicios:

```bash
# Gateway Service
PORT=3000
LIE_DETECTOR_HOST=ms-lie-detector
LIE_DETECTOR_PORT=3001
AUDITOR_HOST=ms-auditor
AUDITOR_PORT=3002

# Lie Detector Service
PORT=3001

# Auditor Service
PORT=3002
```

### Archivos de Configuración

- `.env.example`: Configuración local de desarrollo
- `docker.env.example`: Configuración para entornos Docker

## 🧪 Testing

### APIs Disponibles

- **Puerto 3000**: Gateway API
- **Puerto 3001**: Lie Detector API
- **Puerto 3002**: Auditor API

### Verificar Funcionamiento

```bash
# Health checks
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 🚀 Próximos Pasos

### 1. Desarrollo Local

- ✅ **Servicios funcionando** en puertos 3000, 3001, 3002
- 🔄 **Desarrollo activo** de nuevas funcionalidades
- 🧪 **Testing local** de APIs y endpoints

### 2. CI/CD Pipeline

- ✅ **Workflow configurado** en `ci.yml`
- 🚀 **Despliegue automático** en GHCR
- 🔒 **Seguridad integrada** con SBOM y Provenance

### 3. Testing y Validación

- 🧪 **APIs funcionales** listas para pruebas
- 🔍 **Endpoints de health** verificados
- 📊 **Monitoreo** de servicios en tiempo real

## 🤝 Contribución

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para las guías de contribución.

## 📄 Licencia

Este proyecto está bajo la licencia especificada en [LICENSE](LICENSE).

## 🔒 Seguridad

Reporta vulnerabilidades en [SECURITY.md](SECURITY.md).

---

**AuditMesh** — Construyendo el futuro de la auditoría distribuida 🚀
