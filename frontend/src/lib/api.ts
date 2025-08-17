// Environment variables
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const GATEWAY_BASE = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000'
export const DETECTOR_BASE = import.meta.env.VITE_DETECTOR_URL || 'http://localhost:3001'
export const AUDITOR_BASE = import.meta.env.VITE_AUDITOR_URL || 'http://localhost:3002'
export const JAEGER_BASE = import.meta.env.VITE_JAEGER_URL || 'http://localhost:16686'

// Types
export interface Health {
  status: string
  service: string
  time?: string
  processed?: number
  consumed?: number
  stats?: { length: number }
}

export interface EventPayload {
  actor?: { id: string; type: string }
  subject?: { type: string; id: string }
  action?: string
  payload?: Record<string, unknown>
}

export interface EventResponse {
  accepted: boolean
  event_id: string
  trace_id?: string
}

export interface Proof {
  event_id: string
  proof: string[]
  root: string
  length: number
}

// Utility function for API calls
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed for ${url}:`, error)
    throw error
  }
}

// Health endpoints
export const getGatewayHealth = (): Promise<Health> => 
  apiCall<Health>(`${GATEWAY_BASE}/health`)

export const getDetectorHealth = (): Promise<Health> => 
  apiCall<Health>(`${DETECTOR_BASE}/health`)

export const getAuditorHealth = (): Promise<Health> => 
  apiCall<Health>(`${AUDITOR_BASE}/health`)

// Event publishing
export async function postEvent(body: EventPayload): Promise<EventResponse> {
  return apiCall<EventResponse>(`${GATEWAY_BASE}/events`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Proof retrieval
export const getProof = (eventId: string): Promise<Proof> => 
  apiCall<Proof>(`${AUDITOR_BASE}/proofs/${eventId}`)

// Jaeger integration
export const jaegerTraceLink = (traceId?: string): string => {
  if (!traceId) return `${JAEGER_BASE}/search`
  return `${JAEGER_BASE}/trace/${traceId}`
}

// Service status helper
export function getServiceStatus(health: Health): 'ok' | 'down' | 'warning' | 'unknown' {
  if (!health || !health.status) return 'unknown'
  
  const status = health.status.toLowerCase()
  if (status === 'ok' || status === 'healthy') return 'ok'
  if (status === 'error' || status === 'down') return 'down'
  if (status === 'warning' || status === 'degraded') return 'warning'
  
  return 'unknown'
}

// Batch health check
export async function getAllServicesHealth(): Promise<{
  gateway: Health
  detector: Health
  auditor: Health
}> {
  try {
    const [gateway, detector, auditor] = await Promise.all([
      getGatewayHealth(),
      getDetectorHealth(),
      getAuditorHealth(),
    ])

    return { gateway, detector, auditor }
  } catch (error) {
    console.error('Failed to fetch all services health:', error)
    throw error
  }
}

// Metrics aggregation
export interface ServiceMetrics {
  timestamp: number
  gateway: { status: string; processed?: number }
  detector: { status: string; processed?: number }
  auditor: { status: string; consumed?: number }
}

export async function getServiceMetrics(): Promise<ServiceMetrics> {
  const health = await getAllServicesHealth()
  
  return {
    timestamp: Date.now(),
    gateway: {
      status: getServiceStatus(health.gateway),
      processed: health.gateway.processed,
    },
    detector: {
      status: getServiceStatus(health.detector),
      processed: health.detector.processed,
    },
    auditor: {
      status: getServiceStatus(health.auditor),
      consumed: health.auditor.consumed,
    },
  }
}
