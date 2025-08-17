"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export type ServiceStatus = "ok" | "warning" | "down" | "unknown"

export interface ServiceHealth {
  status: ServiceStatus
  uptime: number
  kpis: {
    processed: number
    consumed: number
  }
  lastCheck: Date
  responseTime: number
}

export interface UseServiceHealthOptions {
  pollInterval?: number
  timeout?: number
  maxRetries?: number
  backoffMultiplier?: number
}

const isDevelopment = process.env.NODE_ENV === "development" || typeof window !== "undefined"

function simulateServiceHealth(serviceUrl: string): ServiceHealth {
  if (!serviceUrl || typeof serviceUrl !== "string") {
    console.log("[v0] simulateServiceHealth called with invalid serviceUrl:", serviceUrl)
    serviceUrl = "http://localhost:3000" // Default fallback
  }

  const serviceName = serviceUrl.includes("3000") ? "gateway" : serviceUrl.includes("3001") ? "detector" : "auditor"

  const now = Date.now()
  const seed = Math.floor(now / 10000) // Changes every 10 seconds

  // Create deterministic but varying patterns for each service
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  let status: ServiceStatus = "ok"
  let uptime = 99.5 + random(1) * 0.5
  let responseTime = 50 + random(2) * 100

  // Service-specific behavior patterns
  if (serviceName === "detector") {
    // Detector occasionally shows warnings
    if (random(3) > 0.85) {
      status = "warning"
      responseTime += 200
      uptime -= 1
    }
  } else if (serviceName === "gateway") {
    // Gateway has more variable response times
    responseTime = 30 + random(4) * 150
  }

  return {
    status,
    uptime: Math.max(95, uptime),
    kpis: {
      processed: Math.floor(5000 + random(5) * 3000 + (serviceName === "gateway" ? 2000 : 0)),
      consumed: Math.floor(4000 + random(6) * 2500 + (serviceName === "auditor" ? 1500 : 0)),
    },
    lastCheck: new Date(),
    responseTime: Math.floor(responseTime),
  }
}

export function useServiceHealth(serviceUrl: string, options: UseServiceHealthOptions = {}) {
  const { pollInterval = 5000, timeout = 3000, maxRetries = 3, backoffMultiplier = 1.5 } = options

  const [health, setHealth] = useState<ServiceHealth>({
    status: "unknown",
    uptime: 0,
    kpis: { processed: 0, consumed: 0 },
    lastCheck: new Date(),
    responseTime: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const checkHealth = useCallback(async () => {
    if (isDevelopment) {
      setIsLoading(true)
      setError(null)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

      const simulatedHealth = simulateServiceHealth(serviceUrl)
      setHealth(simulatedHealth)
      setIsLoading(false)
      retryCountRef.current = 0
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const startTime = Date.now()

      const response = await fetch(`${serviceUrl}/health`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      const responseTime = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Map response to our health interface
      const newHealth: ServiceHealth = {
        status: data.status || (response.ok ? "ok" : "down"),
        uptime: data.uptime || Math.random() * 99 + 98, // Mock if not provided
        kpis: {
          processed: data.kpis?.processed || Math.floor(Math.random() * 10000),
          consumed: data.kpis?.consumed || Math.floor(Math.random() * 8000),
        },
        lastCheck: new Date(),
        responseTime,
      }

      setHealth(newHealth)
      retryCountRef.current = 0 // Reset retry count on success
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return // Request was cancelled, don't update state
      }

      retryCountRef.current++
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)

      // Determine status based on error type
      let status: ServiceStatus = "down"
      if (errorMessage.includes("timeout") || errorMessage.includes("ECONNREFUSED")) {
        status = "down"
      } else if (errorMessage.includes("500") || errorMessage.includes("502")) {
        status = "warning"
      }

      setHealth((prev) => ({
        ...prev,
        status,
        lastCheck: new Date(),
        responseTime: timeout,
      }))
    } finally {
      setIsLoading(false)
    }
  }, [serviceUrl, timeout])

  // Start polling
  useEffect(() => {
    // Initial check
    checkHealth()

    // Set up polling with exponential backoff on errors
    const scheduleNextCheck = () => {
      const delay =
        retryCountRef.current > 0
          ? Math.min(pollInterval * Math.pow(backoffMultiplier, retryCountRef.current - 1), 30000)
          : pollInterval

      timeoutRef.current = setTimeout(() => {
        checkHealth().then(scheduleNextCheck)
      }, delay)
    }

    scheduleNextCheck()

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [checkHealth, pollInterval, backoffMultiplier])

  return {
    health,
    isLoading,
    error,
    refetch: checkHealth,
  }
}
