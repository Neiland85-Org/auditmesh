"use client"

import { Badge } from "@/components/v0dev/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/v0dev/ui/card"
import { cn } from "@/lib/utils"
import type { ServiceStatusIndicatorProps } from "@/types/v0dev/components"

const statusConfig = {
  healthy: {
    color: "bg-green-500",
    badge: "default",
    text: "Healthy",
  },
  warning: {
    color: "bg-yellow-500",
    badge: "secondary",
    text: "Warning",
  },
  error: {
    color: "bg-red-500",
    badge: "destructive",
    text: "Error",
  },
  unknown: {
    color: "bg-gray-500",
    badge: "outline",
    text: "Unknown",
  },
} as const

export function ServiceStatusIndicator({
  service,
  showDetails = false,
  onStatusClick,
  className,
}: ServiceStatusIndicatorProps) {
  const config = statusConfig[service.status]

  const handleClick = () => {
    if (onStatusClick) {
      onStatusClick(service)
    }
  }

  if (!showDetails) {
    return (
      <div
        className={cn("flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity", className)}
        onClick={handleClick}
      >
        <div className={cn("w-3 h-3 rounded-full", config.color)} />
        <span className="text-sm font-medium">{service.name}</span>
        <Badge variant={config.badge as any} className="text-xs">
          {config.text}
        </Badge>
      </div>
    )
  }

  return (
    <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} onClick={handleClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className={cn("w-3 h-3 rounded-full", config.color)} />
          {service.name}
          <Badge variant={config.badge as any} className="ml-auto">
            {config.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Uptime:</span>
          <span className="font-medium">{service.uptime.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Response Time:</span>
          <span className="font-medium">{service.responseTime}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Check:</span>
          <span className="font-medium">{service.lastCheck.toLocaleTimeString()}</span>
        </div>
        {service.endpoint && <div className="text-xs text-muted-foreground truncate">{service.endpoint}</div>}
      </CardContent>
    </Card>
  )
}
