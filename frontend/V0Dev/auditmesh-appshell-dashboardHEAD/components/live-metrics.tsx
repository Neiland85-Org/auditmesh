"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLiveMetrics } from "@/hooks/use-live-metrics"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"

interface LiveMetricsProps {
  services?: string[]
  className?: string
  onInteraction?: () => void
}

const intervalOptions = [
  { value: 60000, label: "1 min" },
  { value: 300000, label: "5 min" },
  { value: 1800000, label: "30 min" },
]

const statusConfig = {
  ok: { color: "#10b981", icon: CheckCircle, bgColor: "bg-green-500/10" },
  warning: { color: "#f59e0b", icon: AlertTriangle, bgColor: "bg-yellow-500/10" },
  down: { color: "#ef4444", icon: XCircle, bgColor: "bg-red-500/10" },
  unknown: { color: "#6b7280", icon: Clock, bgColor: "bg-gray-500/10" },
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{formatTimestamp(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.dataKey}:</span>
            <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function SparklineChart({ data, dataKey, color }: { data: any[]; dataKey: string; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}20`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function LiveMetrics({
  services = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  className = "",
  onInteraction,
}: LiveMetricsProps) {
  const [selectedInterval, setSelectedInterval] = useState(60000)
  const [selectedService, setSelectedService] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"chart" | "sparkline">("chart")

  const { metrics, refetch, isLoading, hasError } = useLiveMetrics(services, {
    intervalMs: selectedInterval,
    maxDataPoints: 50,
  })

  const handleInteraction = () => {
    onInteraction?.()
  }

  const chartData = useMemo(() => {
    if (selectedService === "all") {
      const timestamps = new Set<number>()
      metrics.forEach((service) => {
        service.data.forEach((point) => timestamps.add(point.timestamp))
      })

      return Array.from(timestamps)
        .sort()
        .map((timestamp) => {
          const point: any = { timestamp }
          metrics.forEach((service) => {
            const dataPoint = service.data.find((d) => d.timestamp === timestamp)
            if (dataPoint) {
              point[`${service.serviceName}_processed`] = dataPoint.processed
              point[`${service.serviceName}_consumed`] = dataPoint.consumed
            }
          })
          return point
        })
    } else {
      const service = metrics.find((m) => m.serviceUrl === selectedService)
      return (
        service?.data.map((point) => ({
          timestamp: point.timestamp,
          processed: point.processed,
          consumed: point.consumed,
          responseTime: point.responseTime,
        })) || []
      )
    }
  }, [metrics, selectedService])

  const currentStats = useMemo(() => {
    if (selectedService === "all") {
      const totalProcessed = metrics.reduce((sum, service) => {
        const latest = service.data[service.data.length - 1]
        return sum + (latest?.processed || 0)
      }, 0)

      const totalConsumed = metrics.reduce((sum, service) => {
        const latest = service.data[service.data.length - 1]
        return sum + (latest?.consumed || 0)
      }, 0)

      const avgResponseTime =
        metrics.reduce((sum, service) => {
          const latest = service.data[service.data.length - 1]
          return sum + (latest?.responseTime || 0)
        }, 0) / metrics.length

      return { totalProcessed, totalConsumed, avgResponseTime }
    } else {
      const service = metrics.find((m) => m.serviceUrl === selectedService)
      const latest = service?.data[service.data.length - 1]
      return {
        totalProcessed: latest?.processed || 0,
        totalConsumed: latest?.consumed || 0,
        avgResponseTime: latest?.responseTime || 0,
      }
    }
  }, [metrics, selectedService])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${className}`}
      onClick={handleInteraction}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          >
            <Activity className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Live Metrics</h2>
            <p className="text-sm text-muted-foreground">Real-time forensic monitoring</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedInterval.toString()}
            onValueChange={(value) => {
              setSelectedInterval(Number(value))
              handleInteraction()
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedService}
            onValueChange={(value) => {
              setSelectedService(value)
              handleInteraction()
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {metrics.map((service) => (
                <SelectItem key={service.serviceUrl} value={service.serviceUrl}>
                  {service.serviceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch()
              handleInteraction()
            }}
            disabled={isLoading}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((service) => {
          const StatusIcon = statusConfig[service.status].icon
          return (
            <motion.div
              key={service.serviceUrl}
              layout
              className={`p-4 rounded-lg border ${statusConfig[service.status].bgColor} border-border/50 cursor-pointer`}
              onClick={handleInteraction}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{service.serviceName}</span>
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4" style={{ color: statusConfig[service.status].color }} />
                  <Badge variant="outline" style={{ borderColor: statusConfig[service.status].color }}>
                    {service.status}
                  </Badge>
                </div>
              </div>
              {service.data.length > 0 && (
                <SparklineChart
                  data={service.data.slice(-10)}
                  dataKey="processed"
                  color={statusConfig[service.status].color}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      <Card className="bg-glass border-glass-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Metrics Timeline</span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setViewMode("chart")
                  handleInteraction()
                }}
              >
                Chart
              </Button>
              <Button
                variant={viewMode === "sparkline" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setViewMode("sparkline")
                  handleInteraction()
                }}
                className="sm:hidden"
              >
                Compact
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {chartData.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 text-muted-foreground"
              >
                <Activity className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No data available</p>
                <p className="text-sm">Waiting for metrics...</p>
              </motion.div>
            ) : (
              <motion.div
                key="chart"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="processedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="consumedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />

                    {selectedService === "all" ? (
                      metrics.map((service, index) => (
                        <Area
                          key={`${service.serviceName}_processed`}
                          type="monotone"
                          dataKey={`${service.serviceName}_processed`}
                          stackId="1"
                          stroke={statusConfig[service.status].color}
                          fill={`${statusConfig[service.status].color}40`}
                          strokeWidth={2}
                        />
                      ))
                    ) : (
                      <>
                        <Area
                          type="monotone"
                          dataKey="processed"
                          stroke="#3b82f6"
                          fill="url(#processedGradient)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="consumed"
                          stroke="#06b6d4"
                          fill="url(#consumedGradient)"
                          strokeWidth={2}
                        />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-glass border-glass-border cursor-pointer" onClick={handleInteraction}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Processed</p>
                <p className="text-2xl font-bold text-foreground">{currentStats.totalProcessed.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass-border cursor-pointer" onClick={handleInteraction}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Consumed</p>
                <p className="text-2xl font-bold text-foreground">{currentStats.totalConsumed.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass-border cursor-pointer" onClick={handleInteraction}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(currentStats.avgResponseTime)}ms</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default LiveMetrics
