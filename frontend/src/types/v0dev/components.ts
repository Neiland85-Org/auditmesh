// Tipos para ServiceStatusIndicator
export interface ServiceStatus {
  id: string
  name: string
  status: "healthy" | "warning" | "error" | "unknown"
  uptime: number
  responseTime: number
  lastCheck: Date
  endpoint?: string
}

export interface ServiceStatusIndicatorProps {
  service: ServiceStatus
  showDetails?: boolean
  onStatusClick?: (service: ServiceStatus) => void
  className?: string
}

// Tipos para EventForm
export interface AuditEvent {
  id?: string
  type: "security" | "performance" | "compliance" | "error" | "info"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  source: string
  timestamp?: Date
  metadata?: Record<string, any>
}

export interface EventFormProps {
  initialData?: Partial<AuditEvent>
  onSubmit: (event: AuditEvent) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

// Tipos para MetricsChart
export interface MetricDataPoint {
  timestamp: Date
  value: number
  label?: string
}

export interface MetricSeries {
  id: string
  name: string
  data: MetricDataPoint[]
  color?: string
  unit?: string
}

export interface MetricsChartProps {
  series: MetricSeries[]
  title?: string
  height?: number
  timeRange?: "1h" | "24h" | "7d" | "30d"
  onTimeRangeChange?: (range: string) => void
  showLegend?: boolean
  className?: string
}
