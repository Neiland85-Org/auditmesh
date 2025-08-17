"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuditEvent, LayoutSectionProps } from "@/types/auditmesh"
import { AlertCircle, Info, Shield, AlertTriangle, X } from "lucide-react"

interface EventSectionProps extends LayoutSectionProps {
  data: AuditEvent[]
}

export default function EventSection({ data, onAction, className = "" }: EventSectionProps) {
  const [dismissedEvents, setDismissedEvents] = useState<Set<string>>(new Set())

  const getEventIcon = (type: AuditEvent["type"]) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case "security":
        return <Shield className="w-4 h-4 text-purple-400" />
      default:
        return <Info className="w-4 h-4 text-gray-400" />
    }
  }

  const getEventBadgeColor = (type: AuditEvent["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "security":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleDismissEvent = (eventId: string) => {
    setDismissedEvents((prev) => new Set([...prev, eventId]))
    onAction?.("dismiss", { eventId })
  }

  const handleEventAction = (eventId: string, action: string) => {
    onAction?.(action, { eventId })
  }

  const visibleEvents = data.filter((event) => !dismissedEvents.has(event.id))

  return (
    <Card className={`bg-card/90 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Recent Events ({visibleEvents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {visibleEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent events</p>
              </div>
            ) : (
              visibleEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">{getEventIcon(event.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getEventBadgeColor(event.type)}>{event.type}</Badge>
                      <span className="text-xs text-muted-foreground">{event.service}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-sm text-foreground mb-2">{event.message}</p>

                    {event.details && (
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(event.details).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex gap-1">
                    {event.type === "error" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs bg-transparent"
                        onClick={() => handleEventAction(event.id, "investigate")}
                      >
                        Investigate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDismissEvent(event.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
