"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MicroserviceData, LayoutSectionProps } from "@/types/auditmesh"
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ServicesSectionProps extends LayoutSectionProps {
  data: MicroserviceData[]
  selectedService?: string | null
  onServiceSelect?: (serviceId: string) => void
}

export default function ServicesSection({
  data,
  selectedService,
  onServiceSelect,
  onDataUpdate,
  onAction,
  className = "",
}: ServicesSectionProps) {
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const getStatusIcon = (status: MicroserviceData["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: MicroserviceData["status"]) => {
    switch (status) {
      case "ok":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleServiceClick = useCallback(
    (service: MicroserviceData) => {
      onServiceSelect?.(service.id)
      setExpandedService(expandedService === service.id ? null : service.id)
    },
    [expandedService, onServiceSelect],
  )

  const handleServiceAction = useCallback(
    (serviceId: string, action: string) => {
      onAction?.(action, { serviceId })
    },
    [onAction],
  )

  return (
    <Card className={`bg-card/90 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Services ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {data.map((service) => (
              <div
                key={service.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                  selectedService === service.id ? "border-primary bg-primary/10" : "border-border/30"
                }`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span className="font-medium text-sm">{service.name}</span>
                  </div>
                  <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">{service.description}</p>

                {expandedService === service.id && (
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-muted-foreground">CPU</div>
                        <div className="font-medium">{service.metrics.cpu}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Memory</div>
                        <div className="font-medium">{service.metrics.memory}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Requests</div>
                        <div className="font-medium">{service.metrics.requests}</div>
                      </div>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleServiceAction(service.id, "restart")
                        }}
                      >
                        Restart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleServiceAction(service.id, "logs")
                        }}
                      >
                        Logs
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
