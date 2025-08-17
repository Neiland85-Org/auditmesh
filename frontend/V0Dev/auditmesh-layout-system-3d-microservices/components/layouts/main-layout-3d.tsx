"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Stats } from "@react-three/drei"
import type { MainLayout3DProps } from "@/types/auditmesh"
import Scene3DBackground from "./scene-3d-background"
import ServicesSection from "./services-section"
import MetricsSection from "./metrics-section"
import EventSection from "./event-section"
import NetworkTopologySection from "./network-topology-section"

export default function MainLayout3D({
  services,
  metrics,
  events,
  topology,
  alertRules,
  onServiceUpdate,
  onMetricsUpdate,
  onEventAction,
  onTopologyUpdate,
  children,
}: MainLayout3DProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "detailed" | "topology">("overview")
  const [showStats, setShowStats] = useState(false)
  const [layoutMode, setLayoutMode] = useState<"standard" | "compact" | "expanded">("standard")

  const handleServiceSelect = useCallback((serviceId: string) => {
    setSelectedService(serviceId)
    setViewMode("detailed")

    // Trigger 3D scene focus animation
    const event = new CustomEvent("focusService", { detail: { serviceId } })
    window.dispatchEvent(event)
  }, [])

  const handleServiceUpdate = useCallback(
    (serviceId: string, data: any) => {
      // Validate critical metrics before updating
      if (data.metrics) {
        if (data.metrics.cpu > 90) {
          console.log(`[v0] Critical CPU usage detected for ${serviceId}: ${data.metrics.cpu}%`)
        }
        if (data.metrics.memory > 95) {
          console.log(`[v0] Critical memory usage detected for ${serviceId}: ${data.metrics.memory}%`)
        }
      }

      onServiceUpdate?.(serviceId, data)
    },
    [onServiceUpdate],
  )

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 1024) {
        setLayoutMode("compact")
      } else if (width > 1920) {
        setLayoutMode("expanded")
      } else {
        setLayoutMode("standard")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            setViewMode("overview")
            break
          case "2":
            e.preventDefault()
            setViewMode("detailed")
            break
          case "3":
            e.preventDefault()
            setViewMode("topology")
            break
          case "s":
            e.preventDefault()
            setShowStats(!showStats)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showStats])

  return (
    <div className="w-full h-screen bg-background overflow-hidden relative">
      {/* Enhanced Header Section */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-black text-foreground mb-2">AuditMesh</h1>
            <p className="text-muted-foreground font-sans">
              Microservices Monitoring Dashboard • {services.length} Services •{" "}
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Mode
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  metrics.systemLoad < 50 ? "bg-green-400" : metrics.systemLoad < 80 ? "bg-yellow-400" : "bg-red-400"
                }`}
              ></div>
              <span className="text-sm text-muted-foreground">
                System {metrics.systemLoad < 50 ? "Healthy" : metrics.systemLoad < 80 ? "Warning" : "Critical"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("overview")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "overview"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title="Overview Mode (Ctrl+1)"
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "detailed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title="Detailed Mode (Ctrl+2)"
              >
                Detailed
              </button>
              <button
                onClick={() => setViewMode("topology")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "topology"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title="Network Topology (Ctrl+3)"
              >
                Topology
              </button>
            </div>

            <button
              onClick={() => setShowStats(!showStats)}
              className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground hover:bg-muted/80"
              title="Toggle Performance Stats (Ctrl+S)"
            >
              Stats
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced 3D Scene Background */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} className="w-full h-full">
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ec4899" />

          <Scene3DBackground services={services} selectedService={selectedService} viewMode={viewMode} />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
            autoRotate={viewMode === "overview"}
            autoRotateSpeed={0.5}
          />

          {showStats && <Stats />}
        </Suspense>
      </Canvas>

      {/* Enhanced Modular Sections with Responsive Layout */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Services Section - Responsive positioning */}
        <div
          className={`absolute pointer-events-auto transition-all duration-300 ${
            layoutMode === "compact"
              ? "left-2 top-20 w-64"
              : layoutMode === "expanded"
                ? "left-8 top-1/2 -translate-y-1/2 w-96"
                : "left-6 top-1/2 -translate-y-1/2 w-80"
          }`}
        >
          <ServicesSection
            data={services}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
            onDataUpdate={handleServiceUpdate}
            onServiceInteraction={(serviceId, interaction) => {
              console.log(`[v0] Service interaction: ${interaction} on ${serviceId}`)
            }}
          />
        </div>

        {/* Metrics Section - Responsive positioning */}
        <div
          className={`absolute pointer-events-auto transition-all duration-300 ${
            layoutMode === "compact"
              ? "right-2 top-20 w-56"
              : layoutMode === "expanded"
                ? "right-8 top-24 w-80"
                : "right-6 top-24 w-72"
          }`}
        >
          <MetricsSection data={metrics} onDataUpdate={onMetricsUpdate} alertRules={alertRules} />
        </div>

        {/* Network Topology Section - Only visible in topology mode */}
        {viewMode === "topology" && topology && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto">
            <NetworkTopologySection data={topology} onDataUpdate={onTopologyUpdate} selectedService={selectedService} />
          </div>
        )}

        {/* Event Section - Responsive positioning */}
        <div
          className={`absolute pointer-events-auto transition-all duration-300 ${
            layoutMode === "compact" ? "bottom-2 left-2 right-2 max-h-32" : "bottom-6 left-6 right-6 max-h-48"
          }`}
        >
          <EventSection data={events} onAction={onEventAction} compactMode={layoutMode === "compact"} />
        </div>

        {/* Custom Children */}
        {children}
      </div>
    </div>
  )
}
