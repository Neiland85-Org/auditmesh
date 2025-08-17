"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MicroserviceCardProps {
  name: string
  status: "ok" | "warning" | "down" | "unknown"
  description: string
  metrics: {
    cpu: number
    memory: number
    requests: number
  }
}

const statusConfig = {
  ok: { color: "bg-chart-2", text: "Operational", variant: "default" as const },
  warning: { color: "bg-chart-3", text: "Warning", variant: "secondary" as const },
  down: { color: "bg-destructive", text: "Down", variant: "destructive" as const },
  unknown: { color: "bg-muted", text: "Unknown", variant: "outline" as const },
}

export default function MicroserviceCard({ name, status, description, metrics }: MicroserviceCardProps) {
  const config = statusConfig[status]

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif font-bold text-card-foreground">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`}></div>
            <Badge variant={config.variant} className="text-xs">
              {config.text}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-sans">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">CPU</div>
            <div className="font-semibold text-card-foreground">{metrics.cpu}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Memory</div>
            <div className="font-semibold text-card-foreground">{metrics.memory}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Requests</div>
            <div className="font-semibold text-card-foreground">{metrics.requests}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
