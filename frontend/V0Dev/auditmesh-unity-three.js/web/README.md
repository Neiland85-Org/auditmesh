# AuditMesh Web Frontend

> React-based frontend application with 3D visualization capabilities

This is the web frontend for the AuditMesh platform, built with React, TypeScript, and Vite.

## 🛠️ Technology Stack


- **React 18** - Modern React with hooks and concurrent features


- **TypeScript** - Type-safe JavaScript development


- **Vite** - Fast build tool and development server


- **React Router** - Client-side routing


- **Three.js** - 3D graphics and visualization


- **React Three Fiber** - React renderer for Three.js


- **Axios** - HTTP client for API communication


## 📁 Directory Structure

\`\`\`
web/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx        # Application header
│   │   ├── Footer.tsx        # Application footer
│   │   └── LoadingSpinner.tsx # Loading indicator
│   ├── layouts/              # Page layout components
│   │   ├── MainLayout.tsx    # Main application layout
│   │   └── DashboardLayout.tsx # Dashboard-specific layout
│   ├── scenes/               # 3D visualization components
│   │   ├── AuditVisualization.tsx # Main audit 3D scene
│   │   └── NetworkGraph.tsx  # Network visualization
│   ├── pages/                # Application pages/routes
│   │   ├── HomePage.tsx      # Landing page
│   │   └── DashboardPage.tsx # Dashboard page
│   ├── config/               # Configuration management
│   │   └── environment.ts    # Environment variables handler
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── App.css               # Application styles
│   └── index.css             # Global styles
├── public/                   # Static assets
├── Dockerfile                # Production container
├── Dockerfile.dev            # Development container
├── nginx.conf                # Nginx configuration for production
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
└── .env.example              # Environment variables template
\`\`\`

## 🚀 Development


### Prerequisites



- Node.js 18 or higher


- npm or yarn package manager



### Setup


\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
\`\`\`


### Environment Configuration


Create a `.env` file in the web directory:

\`\`\`env
VITE_API_BASE=http://localhost:3000
VITE_APP_NAME=AuditMesh
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
VITE_ENABLE_3D_VISUALIZATION=true
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_DEBUG_MODE=true
\`\`\`

## 🎨 Component Architecture


### Component Guidelines


1. **Functional Components**: Use React functional components with hooks
2. **TypeScript**: All components must have proper TypeScript interfaces
3. **Props Interface**: Define clear interfaces for component props
4. **Default Props**: Use default parameters for optional props


### Example Component


\`\`\`typescript
import type React from "react"

interface MyComponentProps {
  title: string
  subtitle?: string
  onAction?: () => void
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  subtitle = "Default subtitle", 
  onAction 
}) => {
  return (
    <div className="my-component">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {onAction && (
        <button onClick={onAction}>
          Perform Action
        </button>
      )}
    </div>
  )
}

export default MyComponent
\`\`\`

## 🎯 3D Visualization


### Three.js Integration


The application uses React Three Fiber for 3D visualizations:

\`\`\`typescript
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box } from "@react-three/drei"

const My3DScene: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} args={[1, 1, 1]}>
          <meshStandardMaterial color="hotpink" />
        </Box>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
\`\`\`


### 3D Scene Guidelines


1. **Performance**: Use `useFrame` sparingly and optimize animations
2. **Lighting**: Always include appropriate lighting (ambient + directional/point)
3. **Controls**: Include OrbitControls for user interaction
4. **Responsive**: Make scenes responsive to container size
5. **Loading**: Show loading states for complex 3D assets

## 🔧 Configuration Management


### Environment Variables


The application uses a centralized configuration system:

\`\`\`typescript
// src/config/environment.ts
import { config } from './config/environment'

// Usage in components
const apiUrl = config.apiBase
const isDebugMode = config.features.enableDebugMode
\`\`\`


### Feature Flags


Control features using environment variables:


- `VITE_ENABLE_3D_VISUALIZATION`: Enable/disable 3D features


- `VITE_ENABLE_REAL_TIME_UPDATES`: Enable/disable WebSocket updates


- `VITE_ENABLE_DEBUG_MODE`: Enable/disable debug features


## 🐳 Docker Integration


### Development Container


\`\`\`bash
# Build development image
docker build -f Dockerfile.dev -t auditmesh-web-dev .

# Run development container
docker run -p 5173:5173 -v $(pwd)/src:/app/src auditmesh-web-dev
\`\`\`


### Production Container


\`\`\`bash
# Build production image
docker build -t auditmesh-web .

# Run production container
docker run -p 80:80 auditmesh-web
\`\`\`

## 🧪 Testing


### Running Tests


\`\`\`bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
\`\`\`


### Testing Guidelines


1. **Component Testing**: Test component rendering and interactions
2. **Hook Testing**: Test custom hooks in isolation
3. **Integration Testing**: Test component integration with APIs
4. **3D Testing**: Mock Three.js components for testing

## 🚀 Build and Deployment


### Production Build


\`\`\`bash
# Create optimized production build
npm run build

# The build output will be in the 'dist' directory
\`\`\`


### Build Optimization



- **Code Splitting**: Automatic route-based code splitting


- **Tree Shaking**: Unused code elimination


- **Asset Optimization**: Image and asset optimization


- **Bundle Analysis**: Use `npm run build -- --analyze` to analyze bundle size



### Deployment Options


1. **Docker**: Use the provided Dockerfile for containerized deployment
2. **Static Hosting**: Deploy the `dist` folder to any static hosting service
3. **CDN**: Use a CDN for global distribution of assets

## 🔍 Debugging


### Development Tools



- **React DevTools**: Browser extension for React debugging


- **Vite DevTools**: Built-in development server features


- **TypeScript**: Compile-time error checking


- **ESLint**: Code quality and style checking



### Common Issues


1. **CORS Errors**: Check `VITE_API_BASE` configuration
2. **3D Performance**: Monitor frame rates and optimize animations
3. **Build Errors**: Check TypeScript types and imports
4. **Environment Variables**: Ensure all required variables are set

## 📚 Additional Resources


- [React Documentation](https://react.dev/)


- [Vite Documentation](https://vitejs.dev/)


- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)


- [Three.js Documentation](https://threejs.org/docs/)


- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

