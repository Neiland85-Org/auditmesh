# AuditMesh

> Advanced audit management and visualization platform with 3D interactive components

AuditMesh is a modern web application designed for comprehensive audit management, featuring real-time monitoring, 3D data visualization, and microservices arch
itecture.

## 🏗️ Architecture Overview

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │  API Gateway    │    │   Database      │
│   (React/Vite)  │◄──►│ (Microservice)  │◄──►│  (PostgreSQL)   │
│   Port: 3001    │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │    (Cache)      │
                    │   Port: 6379    │
                    └─────────────────┘
\`\`\`

## 📁 Project Structure

\`\`\`
auditmesh/
├── web/                          # Frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layouts/              # Page layout components
│   │   │   ├── MainLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── scenes/               # 3D visualization components
│   │   │   ├── AuditVisualization.tsx
│   │   │   └── NetworkGraph.tsx
│   │   ├── pages/                # Application pages
│   │   │   ├── HomePage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── config/               # Configuration management
│   │   │   └── environment.ts
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # Application entry point
│   ├── public/                   # Static assets
│   ├── Dockerfile                # Production container
│   ├── Dockerfile.dev            # Development container
│   ├── nginx.conf                # Nginx configuration
│   ├── package.json              # Dependencies and scripts
│   └── vite.config.ts            # Vite configuration
├── scripts/                      # Utility scripts
│   └── setup-env.sh              # Environment setup automation
├── docker-compose.yml            # Production services
├── docker-compose.dev.yml        # Development overrides
├── docker-compose.override.yml   # Local development
├── Makefile                      # Docker management commands
├── .env.example                  # Environment template
├── .env.development              # Development configuration
├── .env.production               # Production template
└── README.md                     # This file
\`\`\`

## 🚀 Quick Start


### Prerequisites



- Docker and Docker Compose


- Node.js 18+ (for local development)


- Make (optional, for convenience commands)



### 1. Environment Setup


\`\`\`bash
# Clone the repository
git clone <repository-url>
cd auditmesh

# Set up environment (interactive)
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh

# Or manually copy environment template
cp .env.example .env
# Edit .env with your configuration
\`\`\`


### 2. Development Mode


\`\`\`bash
# Start all services in development mode
make dev

# Or using docker-compose directly
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
\`\`\`


### 3. Production Mode


\`\`\`bash
# Build and start all services
make build
make up

# Or using docker-compose directly
docker-compose build
docker-compose up -d
\`\`\`


### 4. Access the Application



- **Frontend**: http://localhost:3001 (production) or http://localhost:5173 (development)


- **API Gateway**: http://localhost:3000


- **Database**: localhost:5432 (development only)


- **Redis**: localhost:6379 (development only)


## 🛠️ Development


### Available Commands


\`\`\`bash
# Docker Management
make build      # Build all services
make up         # Start production services
make dev        # Start development services
make down       # Stop all services
make restart    # Restart all services
make clean      # Remove containers, volumes, and images

# Logs and Debugging
make logs       # Show all service logs
make web-logs   # Show web service logs only
make web-shell  # Access web container shell

# Health Checks
make health     # Check service health status

# Database Operations
make db-migrate # Run database migrations
make db-seed    # Seed database with sample data
\`\`\`


### Frontend Development


The web frontend is built with:

- **React 18** with TypeScript


- **Vite** for fast development and building


- **React Router** for client-side routing


- **Three.js** and **React Three Fiber** for 3D visualizations


- **Axios** for API communication


#### Key Features

1. **3D Visualizations**: Interactive audit data visualization using Three.js
2. **Real-time Updates**: Live data updates via WebSocket connections
3. **Responsive Design**: Mobile-first responsive layout
4. **Component Architecture**: Modular, reusable component structure
5. **Type Safety**: Full TypeScript implementation

#### Development Workflow

\`\`\`bash
# Start development server
cd web
npm install
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
\`\`\`


### Adding New Components


1. **UI Components**: Add to `web/src/components/`
2. **Layout Components**: Add to `web/src/layouts/`
3. **3D Scenes**: Add to `web/src/scenes/`
4. **Pages**: Add to `web/src/pages/`

Example component structure:
\`\`\`typescript
// web/src/components/MyComponent.tsx
import type React from "react"

interface MyComponentProps {
  title: string
  onAction?: () => void
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  )
}

export default MyComponent
\`\`\`

## ⚙️ Configuration


### Environment Variables


The application uses environment variables for configuration. Key variables include:

#### Frontend Configuration

- `VITE_API_BASE`: API gateway URL


- `VITE_APP_NAME`: Application name


- `VITE_ENABLE_3D_VISUALIZATION`: Enable/disable 3D features


- `VITE_ENABLE_REAL_TIME_UPDATES`: Enable/disable real-time updates


#### Backend Configuration

- `JWT_SECRET`: JWT signing secret


- `DATABASE_URL`: PostgreSQL connection string


- `REDIS_HOST`: Redis server host


- `CORS_ORIGIN`: Allowed CORS origins


#### Security Configuration

- `SECURE_COOKIES`: Enable secure cookies in production


- `CSRF_PROTECTION`: Enable CSRF protection


- `API_RATE_LIMIT`: API rate limiting


See `.env.example` for complete configuration options.


### Docker Services


#### Web Service

- **Image**: Custom React/Vite application


- **Port**: 3001 (production), 5173 (development)


- **Health Check**: `/health` endpoint


- **Dependencies**: API Gateway


#### API Gateway

- **Image**: Node.js microservice


- **Port**: 3000


- **Health Check**: `/health` endpoint


- **Dependencies**: Database, Redis


#### Database

- **Image**: PostgreSQL 15 Alpine


- **Port**: 5432


- **Volumes**: Persistent data storage


- **Health Check**: `pg_isready`


#### Redis

- **Image**: Redis 7 Alpine


- **Port**: 6379


- **Volumes**: Persistent cache storage


- **Health Check**: `redis-cli ping`


## 🔧 Customization


### Adding New 3D Visualizations


1. Create a new component in `web/src/scenes/`
2. Use React Three Fiber for 3D rendering
3. Follow the existing pattern from `AuditVisualization.tsx`

\`\`\`typescript
// Example 3D component
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

const MyVisualization: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* Your 3D content here */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}
\`\`\`


### Extending the API


1. Add new routes to the API Gateway
2. Update environment variables if needed
3. Update the frontend API client configuration


### Database Schema Changes


1. Create migration scripts in `scripts/`
2. Update the database service configuration
3. Run migrations using `make db-migrate`

## 🚀 Deployment


### Production Deployment


1. **Environment Setup**:
   \`\`\`bash
   ./scripts/setup-env.sh
   # Select "production" when prompted
   \`\`\`

2. **Security Configuration**:
   - Update all passwords and secrets in `.env`
   - Configure SSL certificates
   - Set up proper domain names

3. **Build and Deploy**:
   \`\`\`bash
   make build
   make up
   \`\`\`

4. **Health Verification**:
   \`\`\`bash
   make health
   \`\`\`


### Docker Compose Production


\`\`\`bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# With custom environment
docker-compose --env-file .env.production up -d
\`\`\`


### Environment-Specific Deployments



- **Development**: Uses `docker-compose.dev.yml` with hot reloading


- **Staging**: Uses production configuration with staging environment variables


- **Production**: Uses optimized builds with security hardening


## 🔍 Monitoring and Debugging


### Health Checks


All services include health checks:

- **Web**: `GET /health` returns service status


- **API Gateway**: `GET /health` returns API status


- **Database**: PostgreSQL connection check


- **Redis**: Redis ping check



### Logging



- **Development**: Pretty-formatted logs with debug level


- **Production**: JSON-formatted logs with appropriate levels


- **Log Aggregation**: Logs are available via `make logs`



### Debugging


\`\`\`bash
# View service logs
make logs
make web-logs

# Access container shell
make web-shell
docker-compose exec ms-gateway sh

# Check service status
docker-compose ps
make health
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the project structure
4. Test your changes: `make dev`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request


### Development Guidelines



- Follow TypeScript best practices


- Use the existing component patterns


- Add proper error handling


- Include appropriate tests


- Update documentation for new features


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support


- **Issues**: Create an issue on GitHub


- **Documentation**: Check this README and inline code comments


- **Health Checks**: Use `make health` to diagnose service issues


## 🔄 Changelog


### v1.0.0


- Initial release with React frontend


- Docker containerization


- 3D visualization capabilities


- Microservices architecture


- Comprehensive environment configuration

