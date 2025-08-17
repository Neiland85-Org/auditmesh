"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SystemMetrics, LayoutSectionProps } from "@/types/auditmesh"
import { BarChart3, Clock, Server, Zap } from "lucide-react"

interface MetricsSectionProps extends LayoutSectionProps {
  data: SystemMetrics
}

export default function MetricsSection({ data, onDataUpdate, onAction, className = "" }: MetricsSectionProps) {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getSystemHealthColor = () => {
    if (data.systemLoad < 50) return "text-green-400"
    if (data.systemLoad < 80) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className={`bg-card/90 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Services Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Server className="w-6 h-6 mx-auto mb-1 text-blue-400" />
            <div className="text-2xl font-bold">{data.activeServices}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold">{data.totalServices}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* System Load */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              System Load
            </span>
            <span className={`text-sm font-bold ${getSystemHealthColor()}`}>{data.systemLoad}%</span>
          </div>
          <Progress value={data.systemLoad} className="h-2" />
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Requests</span>
            <span className="text-sm font-medium">{data.totalRequests.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="text-sm font-medium">{data.averageResponseTime}ms</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Uptime
            </span>
            <span className="text-sm font-medium text-green-400">{formatUptime(data.uptime)}</span>
          </div>
        </div>

        {/* Health Indicator */}
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                data.systemLoad < 50 ? "bg-green-400" : data.systemLoad < 80 ? "bg-yellow-400" : "bg-red-400"
              }`}
            ></div>
            <span className="text-xs text-muted-foreground">
              System {data.systemLoad < 50 ? "Healthy" : data.systemLoad < 80 ? "Warning" : "Critical"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
