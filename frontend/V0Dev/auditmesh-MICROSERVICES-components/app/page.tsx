"use client"

import { useState } from "react"
import { ServiceStatusIndicator } from "@/components/service-status-indicator"
import { EventForm } from "@/components/event-form"
import { MetricsChart } from "@/components/metrics-chart"
import { StarField3D } from "@/components/star-field-3d"
import type { ServiceStatus, AuditEvent, MetricSeries } from "@/types/components"

// Datos de ejemplo
const mockServices: ServiceStatus[] = [
  {
    id: "api-gateway",
    name: "API Gateway",
    status: "healthy",
    uptime: 99.9,
    responseTime: 45,
    lastCheck: new Date(),
    endpoint: "https://api.auditmesh.com/gateway",
  },
  {
    id: "auth-service",
    name: "Auth Service",
    status: "warning",
    uptime: 98.5,
    responseTime: 120,
    lastCheck: new Date(),
    endpoint: "https://api.auditmesh.com/auth",
  },
  {
    id: "audit-processor",
    name: "Audit Processor",
    status: "error",
    uptime: 85.2,
    responseTime: 250,
    lastCheck: new Date(),
    endpoint: "https://api.auditmesh.com/processor",
  },
]

const mockMetrics: MetricSeries[] = [
  {
    id: "cpu",
    name: "CPU Usage",
    unit: "%",
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
      value: Math.random() * 100,
    })),
  },
  {
    id: "memory",
    name: "Memory Usage",
    unit: "%",
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
      value: Math.random() * 80 + 20,
    })),
  },
]

export default function ComponentsDemo() {
  const [showEventForm, setShowEventForm] = useState(false)

  const handleEventSubmit = async (event: AuditEvent) => {
    console.log("Event submitted:", event)
    // Aquí se integraría con el microservicio
    setShowEventForm(false)
  }

  const handleServiceClick = (service: ServiceStatus) => {
    console.log("Service clicked:", service)
    // Aquí se podría abrir un modal con más detalles
  }

  return (
    <StarField3D count={3000}>
      <div className="container mx-auto p-6 space-y-8 text-white">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">AuditMesh Components Demo</h1>

        {/* Service Status Indicators */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow-md">Service Status Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockServices.map((service) => (
              <ServiceStatusIndicator
                key={service.id}
                service={service}
                showDetails={true}
                onStatusClick={handleServiceClick}
              />
            ))}
          </div>

          {/* Compact version */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white drop-shadow-md">Compact View</h3>
            <div className="space-y-2">
              {mockServices.map((service) => (
                <ServiceStatusIndicator
                  key={`compact-${service.id}`}
                  service={service}
                  showDetails={false}
                  onStatusClick={handleServiceClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Event Form */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white drop-shadow-md">Event Form</h2>
            <button
              onClick={() => setShowEventForm(!showEventForm)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-lg hover:shadow-xl transition-shadow"
            >
              {showEventForm ? "Hide Form" : "Show Form"}
            </button>
          </div>

          {showEventForm && <EventForm onSubmit={handleEventSubmit} onCancel={() => setShowEventForm(false)} />}
        </section>

        {/* Metrics Chart */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow-md">Metrics Chart</h2>
          <MetricsChart
            series={mockMetrics}
            title="System Performance Metrics"
            timeRange="24h"
            onTimeRangeChange={(range) => console.log("Time range changed:", range)}
          />
        </section>
      </div>
    </StarField3D>
  )
}
