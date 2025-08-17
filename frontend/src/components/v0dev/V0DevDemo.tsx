"use client"

import { useState } from "react"
import { ServiceStatusIndicator, EventForm, MetricsChart } from "./index"
import type { ServiceStatus, AuditEvent, MetricSeries } from "@/types/v0dev"

// Datos de ejemplo para la demostración
const mockServices: ServiceStatus[] = [
  {
    id: "ms-gateway",
    name: "MS Gateway",
    status: "healthy",
    uptime: 99.8,
    responseTime: 45,
    lastCheck: new Date(),
    endpoint: "https://gateway.auditmesh.local"
  },
  {
    id: "ms-auditor",
    name: "MS Auditor",
    status: "warning",
    uptime: 95.2,
    responseTime: 120,
    lastCheck: new Date(Date.now() - 300000),
    endpoint: "https://auditor.auditmesh.local"
  },
  {
    id: "ms-detector",
    name: "MS Lie Detector",
    status: "error",
    uptime: 87.5,
    responseTime: 500,
    lastCheck: new Date(Date.now() - 600000),
    endpoint: "https://detector.auditmesh.local"
  }
]

const mockMetrics: MetricSeries[] = [
  {
    id: "requests",
    name: "Total Requests",
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: Math.floor(Math.random() * 1000) + 500
    })),
    unit: "req/s"
  },
  {
    id: "responseTime",
    name: "Response Time",
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: Math.floor(Math.random() * 200) + 50
    })),
    unit: "ms"
  }
]

export function V0DevDemo() {
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)

  const handleServiceClick = (service: ServiceStatus) => {
    setSelectedService(service)
    console.log("Service clicked:", service)
  }

  const handleEventSubmit = async (event: AuditEvent) => {
    console.log("Event submitted:", event)
    // Aquí se enviaría el evento al backend
    setShowEventForm(false)
  }

  const handleTimeRangeChange = (range: string) => {
    console.log("Time range changed:", range)
  }

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎨 V0Dev Components Demo</h1>
        <p className="text-muted-foreground">
          Demostración de los componentes migrados desde V0Dev
        </p>
      </div>

      {/* Service Status Indicators */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Service Status Indicators</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <ServiceStatusIndicator
              key={service.id}
              service={service}
              showDetails={true}
              onStatusClick={handleServiceClick}
              className="hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>

      {/* Metrics Chart */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Live Metrics</h2>
        <MetricsChart
          series={mockMetrics}
          title="System Performance Metrics"
          height={400}
          timeRange="24h"
          onTimeRangeChange={handleTimeRangeChange}
          showLegend={true}
        />
      </div>

      {/* Event Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Event Management</h2>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showEventForm ? "Hide Form" : "Create Event"}
          </button>
        </div>
        
        {showEventForm && (
          <EventForm
            onSubmit={handleEventSubmit}
            onCancel={() => setShowEventForm(false)}
            className="max-w-2xl mx-auto"
          />
        )}
      </div>

      {/* Selected Service Details */}
      {selectedService && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Selected Service Details</h2>
          <div className="p-4 border rounded-lg bg-muted/50">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(selectedService, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
