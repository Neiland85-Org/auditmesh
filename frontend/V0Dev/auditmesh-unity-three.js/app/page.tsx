export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AuditMesh Frontend Infrastructure</h1>
          <p className="text-xl text-gray-600">
            Complete frontend setup with Docker containerization and 3D visualization capabilities
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📁 Directory Structure</h2>
            <div className="space-y-2 text-sm font-mono text-gray-600">
              <div>web/</div>
              <div className="ml-4">├── src/</div>
              <div className="ml-8">├── components/</div>
              <div className="ml-8">├── layouts/</div>
              <div className="ml-8">├── scenes/ (3D)</div>
              <div className="ml-8">└── pages/</div>
              <div className="ml-4">├── Dockerfile</div>
              <div className="ml-4">└── nginx.conf</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🐳 Docker Services</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Web Frontend (React/Vite)
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                API Gateway (Port 3000)
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                PostgreSQL Database
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                Redis Cache
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Environment Config</h3>
            <p className="text-gray-600 text-sm mb-4">Multiple environment setups with security considerations</p>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded">VITE_API_BASE=http://ms-gateway:3000</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">3D Visualization</h3>
            <p className="text-gray-600 text-sm mb-4">Three.js and React Three Fiber integration</p>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded">scenes/AuditVisualization.tsx</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Deploy</h3>
            <p className="text-gray-600 text-sm mb-4">Production-ready with Docker Compose</p>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded">make build && make up</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">🚀 Quick Start Commands</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Development Mode</h3>
              <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">
                ./scripts/setup-env.sh && make dev
              </code>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Production Deployment</h3>
              <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">make build && make up</code>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Health Check</h3>
              <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">make health</code>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">📚 Documentation Available</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Main Documentation</h3>
              <ul className="text-blue-600 space-y-1 text-sm">
                <li>• README.md - Complete setup guide</li>
                <li>• web/README.md - Frontend specific docs</li>
                <li>• DEPLOYMENT.md - Production deployment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Configuration Files</h3>
              <ul className="text-blue-600 space-y-1 text-sm">
                <li>• .env.example - Environment template</li>
                <li>• docker-compose.yml - Service definitions</li>
                <li>• Makefile - Management commands</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            The web/ directory contains the complete React frontend with 3D visualization capabilities.
            <br />
            Use the Docker setup to run the full auditmesh platform with all services.
          </p>
        </div>
      </div>
    </div>
  )
}
