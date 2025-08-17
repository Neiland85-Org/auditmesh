"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import MicroserviceCard from "@/components/microservice-card"
import Scene3D from "@/components/scene-3d"

export default function AuditMeshDashboard() {
  return (
    <div className="w-full h-screen bg-background overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-black text-foreground mb-2">AuditMesh</h1>
            <p className="text-muted-foreground font-sans">Microservices Monitoring Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-2 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} className="w-full h-full">
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ec4899" />

          <Scene3D />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Status Panel */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MicroserviceCard
              name="ms-gateway"
              status="ok"
              description="API Gateway Service"
              metrics={{ cpu: 45, memory: 62, requests: 1247 }}
            />
            <MicroserviceCard
              name="ms-lie-detector"
              status="warning"
              description="Lie Detection Service"
              metrics={{ cpu: 78, memory: 84, requests: 892 }}
            />
            <MicroserviceCard
              name="ms-auditor"
              status="ok"
              description="Audit Logging Service"
              metrics={{ cpu: 32, memory: 48, requests: 2156 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
