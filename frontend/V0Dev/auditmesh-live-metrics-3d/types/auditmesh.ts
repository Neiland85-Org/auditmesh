import type React from "react"
// Types for AuditMesh microservices and monitoring data
export interface MicroserviceData {
  id: string
  name: string
  status: "ok" | "warning" | "error" | "unknown"
  description: string
  metrics: {
    cpu: number
    memory: number
    requests: number
    responseTime?: number
    errorRate?: number
    processed?: number
    consumed?: number
  }
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export interface SystemMetrics {
  totalServices: number
  activeServices: number
  totalRequests: number
  averageResponseTime: number
  systemLoad: number
  uptime: number
}

export interface AuditEvent {
  id: string
  timestamp: Date
  service: string
  type: "info" | "warning" | "error" | "security"
  message: string
  details?: Record<string, any>
}

export interface MicroserviceConnection {
  from: string
  to: string
  type: "api" | "database" | "message_queue" | "cache"
  status: "active" | "inactive" | "error"
  latency?: number
}

export interface NetworkTopology {
  services: MicroserviceData[]
  connections: MicroserviceConnection[]
}

export interface AlertRule {
  id: string
  name: string
  condition: string
  threshold: number
  enabled: boolean
}

export interface LiveMetricsData {
  serviceId: string
  serviceName: string
  processed: number
  consumed: number
  timestamp: Date
  status: "ok" | "warning" | "error"
}

export interface HealthResponse {
  status: string
  metrics: {
    processed: number
    consumed: number
    uptime: number
    [key: string]: any
  }
}

export interface LayoutSectionProps {
  data?: any
  onDataUpdate?: (data: any) => void
  onAction?: (action: string, payload?: any) => void
  onServiceInteraction?: (serviceId: string, interaction: string) => void
  className?: string
}

export interface MainLayout3DProps {
  services: MicroserviceData[]
  metrics: SystemMetrics
  events: AuditEvent[]
  topology?: NetworkTopology
  alertRules?: AlertRule[]
  onServiceUpdate?: (serviceId: string, data: Partial<MicroserviceData>) => void
  onMetricsUpdate?: (metrics: Partial<SystemMetrics>) => void
  onEventAction?: (eventId: string, action: string) => void
  onTopologyUpdate?: (topology: NetworkTopology) => void
  children?: React.ReactNode
}
