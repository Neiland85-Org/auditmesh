"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface MetricDataPoint {
  timestamp: number
  processed: number
  consumed: number
  responseTime: number
  uptime: number
}

export interface ServiceMetrics {
  serviceUrl: string
  serviceName: string
  data: MetricDataPoint[]
  status: "ok" | "warning" | "down" | "unknown"
  isLoading: boolean
  error: string | null
}

export interface UseLiveMetricsOptions {
  intervalMs?: number
  maxDataPoints?: number
  timeout?: number
  maxRetries?: number
  backoffMultiplier?: number
}

const isDevelopment = process.env.NODE_ENV === "development" || typeof window !== "undefined"

function generateMockMetrics(serviceUrl: string, timestamp: number): Omit<MetricDataPoint, "timestamp"> {
  const serviceName = serviceUrl.includes("3000") ? "gateway" : serviceUrl.includes("3001") ? "detector" : "auditor"
  const seed = Math.floor(timestamp / 1000) // Changes every second

  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  // Service-specific patterns
  let baseProcessed = 1000
  let baseConsumed = 800
  let baseResponseTime = 50
  let baseUptime = 99.5

  if (serviceName === "gateway") {
    baseProcessed = 1500
    baseConsumed = 1200
    baseResponseTime = 30
  } else if (serviceName === "detector") {
    baseProcessed = 800
    baseConsumed = 600
    baseResponseTime = 80
    // Occasional spikes
    if (random(1) > 0.8) {
      baseProcessed *= 1.5
      baseResponseTime *= 2
      baseUptime -= 0.5
    }
  }

  return {
    processed: Math.floor(baseProcessed + random(2) * 500),
    consumed: Math.floor(baseConsumed + random(3) * 400),
    responseTime: Math.floor(baseResponseTime + random(4) * 100),
    uptime: Math.max(95, baseUptime + random(5) * 2),
  }
}

export function useLiveMetrics(services: string[], options: UseLiveMetricsOptions = {}) {
  const {
    intervalMs = 60000, // 1 minute default
    maxDataPoints = 50,
    timeout = 3000,
    maxRetries = 3,
    backoffMultiplier = 1.5,
  } = options

  const [metrics, setMetrics] = useState<ServiceMetrics[]>(() =>
    services.map((serviceUrl) => ({
      serviceUrl,
      serviceName: serviceUrl.includes("3000") ? "Gateway" : serviceUrl.includes("3001") ? "Detector" : "Auditor",
      data: [],
      status: "unknown" as const,
      isLoading: false,
      error: null,
    })),
  )

  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const retryCountsRef = useRef<Map<string, number>>(new Map())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMetrics = useCallback(async () => {
    const timestamp = Date.now()

    if (isDevelopment) {
      setMetrics((prevMetrics) =>
        prevMetrics.map((serviceMetric) => {
          const mockData = generateMockMetrics(serviceMetric.serviceUrl, timestamp)
          const newDataPoint: MetricDataPoint = {
            timestamp,
            ...mockData,
          }

          const newData = [...serviceMetric.data, newDataPoint].slice(-maxDataPoints)

          return {
            ...serviceMetric,
            data: newData,
            status: mockData.uptime > 98 ? "ok" : mockData.uptime > 95 ? "warning" : "down",
            isLoading: false,
            error: null,
          }
        }),
      )
      return
    }

    const promises = services.map(async (serviceUrl) => {
      // Cancel previous request
      const existingController = abortControllersRef.current.get(serviceUrl)
      if (existingController) {
        existingController.abort()
      }

      const controller = new AbortController()
      abortControllersRef.current.set(serviceUrl, controller)

      try {
        const startTime = Date.now()
        const response = await fetch(`${serviceUrl}/health`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: timeout,
        })

        const responseTime = Date.now() - startTime

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        retryCountsRef.current.set(serviceUrl, 0) // Reset retry count on success

        return {
          serviceUrl,
          dataPoint: {
            timestamp,
            processed: data.kpis?.processed || 0,
            consumed: data.kpis?.consumed || 0,
            responseTime,
            uptime: data.uptime || 0,
          } as MetricDataPoint,
          status: data.status || "ok",
          error: null,
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return null // Request was cancelled
        }

        const currentRetries = retryCountsRef.current.get(serviceUrl) || 0
        retryCountsRef.current.set(serviceUrl, currentRetries + 1)

        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        let status: "ok" | "warning" | "down" | "unknown" = "down"

        if (errorMessage.includes("timeout")) {
          status = "warning"
        }

        return {
          serviceUrl,
          dataPoint: {
            timestamp,
            processed: 0,
            consumed: 0,
            responseTime: timeout,
            uptime: 0,
          } as MetricDataPoint,
          status,
          error: errorMessage,
        }
      }
    })

    const results = await Promise.all(promises)

    setMetrics((prevMetrics) =>
      prevMetrics.map((serviceMetric) => {
        const result = results.find((r) => r?.serviceUrl === serviceMetric.serviceUrl)
        if (!result) return serviceMetric

        const newData = [...serviceMetric.data, result.dataPoint].slice(-maxDataPoints)

        return {
          ...serviceMetric,
          data: newData,
          status: result.status,
          isLoading: false,
          error: result.error,
        }
      }),
    )
  }, [services, maxDataPoints, timeout])

  useEffect(() => {
    // Initial fetch
    fetchMetrics()

    // Set up interval polling
    intervalRef.current = setInterval(() => {
      fetchMetrics()
    }, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // Cancel all pending requests
      abortControllersRef.current.forEach((controller) => controller.abort())
      abortControllersRef.current.clear()
    }
  }, [fetchMetrics, intervalMs])

  const refetch = useCallback(() => {
    setMetrics((prev) => prev.map((m) => ({ ...m, isLoading: true })))
    fetchMetrics()
  }, [fetchMetrics])

  return {
    metrics,
    refetch,
    isLoading: metrics.some((m) => m.isLoading),
    hasError: metrics.some((m) => m.error !== null),
  }
}
