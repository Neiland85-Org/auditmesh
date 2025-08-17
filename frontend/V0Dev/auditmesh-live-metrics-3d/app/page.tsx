"use client"

import { useState, useEffect } from "react"
import MainLayout3D from "@/components/layouts/main-layout-3d"
import LiveMetrics3D from "@/components/live-metrics-3d"
import type { MicroserviceData, SystemMetrics, AuditEvent } from "@/types/auditmesh"

export default function AuditMeshDashboard() {
  const [services, setServices] = useState<MicroserviceData[]>([
    {
      id: "ms-gateway",
      name: "Gateway",
      status: "ok",
      description: "API Gateway Service",
      metrics: { cpu: 45, memory: 62, requests: 1247, responseTime: 120, errorRate: 0.1 },
      position: [-3, 1, 0],
      rotation: [0, 0.2, 0],
    },
    {
      id: "ms-lie-detector",
      name: "Lie Detector",
      status: "warning",
      description: "Lie Detection Service",
      metrics: { cpu: 78, memory: 84, requests: 892, responseTime: 250, errorRate: 2.3 },
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    {
      id: "ms-auditor",
      name: "Auditor",
      status: "ok",
      description: "Audit Logging Service",
      metrics: { cpu: 32, memory: 48, requests: 2156, responseTime: 95, errorRate: 0.05 },
      position: [3, -1, 0],
      rotation: [0, -0.2, 0],
    },
  ])

  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalServices: 3,
    activeServices: 3,
    totalRequests: 4295,
    averageResponseTime: 155,
    systemLoad: 65,
    uptime: 86400 * 7 + 3600 * 4, // 7 days, 4 hours
  })

  const [events, setEvents] = useState<AuditEvent[]>([
    {
      id: "evt-1",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      service: "ms-lie-detector",
      type: "warning",
      message: "High CPU usage detected",
      details: { cpu: 78, threshold: 75 },
    },
    {
      id: "evt-2",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      service: "ms-gateway",
      type: "info",
      message: "Service restarted successfully",
      details: { previousUptime: 3600 },
    },
    {
      id: "evt-3",
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      service: "ms-auditor",
      type: "security",
      message: "Suspicious access pattern detected",
      details: { ip: "192.168.1.100", attempts: 5 },
    },
  ])

  const handleServiceUpdate = (serviceId: string, data: Partial<MicroserviceData>) => {
    setServices((prev) => prev.map((service) => (service.id === serviceId ? { ...service, ...data } : service)))
  }

  const handleMetricsUpdate = (newMetrics: Partial<SystemMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...newMetrics }))
  }

  const handleEventAction = (eventId: string, action: string) => {
    console.log(`[v0] Event action: ${action} for event ${eventId}`)

    if (action === "dismiss") {
      // Event dismissal is handled by the EventSection component
      return
    }

    if (action === "investigate") {
      // Here you would typically open a detailed investigation view
      console.log(`[v0] Opening investigation for event ${eventId}`)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics((prev) => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
        averageResponseTime: Math.max(50, prev.averageResponseTime + (Math.random() - 0.5) * 20),
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + (Math.random() - 0.5) * 10)),
      }))

      // Simulate service metrics updates
      setServices((prev) =>
        prev.map((service) => ({
          ...service,
          metrics: {
            ...service.metrics,
            cpu: Math.max(0, Math.min(100, service.metrics.cpu + (Math.random() - 0.5) * 5)),
            memory: Math.max(0, Math.min(100, service.metrics.memory + (Math.random() - 0.5) * 3)),
            requests: service.metrics.requests + Math.floor(Math.random() * 5),
          },
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AuditMesh Dashboard
          </h1>
          <p className="text-muted-foreground">Real-time 3D monitoring for microservices architecture</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveMetrics3D className="h-96" />
          <div className="h-96">
            <MainLayout3D
              services={services}
              metrics={metrics}
              events={events}
              onServiceUpdate={handleServiceUpdate}
              onMetricsUpdate={handleMetricsUpdate}
              onEventAction={handleEventAction}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
