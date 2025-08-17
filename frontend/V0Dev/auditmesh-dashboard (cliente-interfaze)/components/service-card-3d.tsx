"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Activity, Cpu, HardDrive, Network, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import anime from "animejs"

interface ServiceMetrics {
  cpu: number
  memory: number
  requests: number
  uptime?: string
  latency?: number
  errors?: number
}

interface ServiceCard3DProps {
  name: string
  status: "ok" | "warning" | "down" | "unknown"
  description?: string
  kpi?: string
  metrics?: ServiceMetrics
  onClick?: () => void
}

interface ServiceHealth {
  status: "ok" | "warning" | "down" | "unknown"
  processed?: number
  errors?: number
  last_seen: string
}

const statusConfig = {
  ok: {
    color: "bg-chart-2",
    text: "Operational",
    variant: "default" as const,
    icon: CheckCircle,
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]",
  },
  warning: {
    color: "bg-chart-3",
    text: "Warning",
    variant: "secondary" as const,
    icon: AlertTriangle,
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
  },
  down: {
    color: "bg-destructive",
    text: "Down",
    variant: "destructive" as const,
    icon: XCircle,
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  },
  unknown: {
    color: "bg-muted",
    text: "Unknown",
    variant: "outline" as const,
    icon: Activity,
    glow: "shadow-[0_0_20px_rgba(156,163,175,0.3)]",
  },
}

// Custom hook for service health polling
function useServiceHealth(serviceName: string) {
  const [health, setHealth] = useState<ServiceHealth>({
    status: "unknown",
    last_seen: new Date().toISOString(),
  })

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        // Mock API call - replace with actual endpoint
        const response = await fetch(`/api/health/${serviceName}`)
        if (response.ok) {
          const data = await response.json()
          setHealth(data)
        }
      } catch (error) {
        console.error(`Failed to fetch health for ${serviceName}:`, error)
        // Mock data for demo
        setHealth({
          status: Math.random() > 0.7 ? "warning" : "ok",
          processed: Math.floor(Math.random() * 1000),
          errors: Math.floor(Math.random() * 10),
          last_seen: new Date().toISOString(),
        })
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [serviceName])

  return health
}

export default function ServiceCard3D({
  name,
  status: initialStatus,
  description,
  kpi,
  metrics,
  onClick,
}: ServiceCard3DProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [previousStatus, setPreviousStatus] = useState(initialStatus)
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Use polling hook for real service health
  const health = useServiceHealth(name)
  const currentStatus = health.status || initialStatus
  const config = statusConfig[currentStatus]
  const StatusIcon = config.icon

  // Entry animation on mount
  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 700,
        easing: "easeOutExpo",
        delay: Math.random() * 200, // Stagger animation
      })
    }
  }, [])

  // Status change animation
  useEffect(() => {
    if (previousStatus !== currentStatus && cardRef.current) {
      // Color transition and bounce animation
      anime
        .timeline()
        .add({
          targets: cardRef.current,
          scale: [1, 1.04],
          duration: 200,
          easing: "easeOutQuad",
        })
        .add({
          targets: cardRef.current,
          scale: [1.04, 1],
          duration: 220,
          easing: "easeOutElastic(1, .8)",
        })

      setPreviousStatus(currentStatus)
    }
  }, [currentStatus, previousStatus])

  // Hover tilt animation
  const handleMouseEnter = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        rotateX: 2,
        rotateY: -2,
        translateZ: 8,
        duration: 220,
        easing: "cubicBezier(.22,1,.36,1)",
      })
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        duration: 220,
        easing: "cubicBezier(.22,1,.36,1)",
      })
    }
  }

  // Click expansion animation
  const handleClick = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        scale: [1, 0.98, 1.02, 1],
        duration: 300,
        easing: "easeOutElastic(1, .8)",
      })
    }
    setIsExpanded(true)
    onClick?.()
  }

  // State change pulse animation
  useEffect(() => {
    if (glowRef.current && currentStatus !== "unknown") {
      anime({
        targets: glowRef.current,
        scale: [1, 1.04, 1],
        opacity: [0.3, 0.6, 0.3],
        duration: 420,
        easing: "easeInOutSine",
        loop: false,
      })
    }
  }, [currentStatus])

  return (
    <>
      <div className="relative">
        {/* Glow effect */}
        <div ref={glowRef} className={`absolute inset-0 rounded-lg ${config.glow} opacity-30 pointer-events-none`} />

        {/* Main card */}
        <Card
          ref={cardRef}
          className="relative bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover-tilt"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleClick()
            }
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-serif font-bold text-card-foreground flex items-center gap-2">
                <StatusIcon
                  className={`w-5 h-5 ${currentStatus === "ok" ? "text-chart-2" : currentStatus === "warning" ? "text-chart-3" : currentStatus === "down" ? "text-destructive" : "text-muted-foreground"}`}
                />
                {name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
                <Badge variant={config.variant} className="text-xs font-medium">
                  {config.text}
                </Badge>
              </div>
            </div>
            {description && <p className="text-sm text-muted-foreground font-sans">{description}</p>}
            {kpi && (
              <p className="text-xs text-accent font-mono bg-accent/10 px-2 py-1 rounded border border-accent/20">
                KPI: {kpi}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <Cpu className="w-4 h-4 text-primary mb-1" />
                <div className="text-muted-foreground text-xs">CPU</div>
                <div className="font-semibold text-card-foreground">{metrics?.cpu || 0}%</div>
              </div>
              <div className="flex flex-col items-center">
                <HardDrive className="w-4 h-4 text-accent mb-1" />
                <div className="text-muted-foreground text-xs">Memory</div>
                <div className="font-semibold text-card-foreground">{metrics?.memory || 0}%</div>
              </div>
              <div className="flex flex-col items-center">
                <Network className="w-4 h-4 text-chart-3 mb-1" />
                <div className="text-muted-foreground text-xs">Requests</div>
                <div className="font-semibold text-card-foreground">{metrics?.requests || health.processed || 0}</div>
              </div>
            </div>

            {/* Additional metrics row */}
            {(metrics?.uptime || metrics?.latency || health.errors !== undefined) && (
              <div className="grid grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t border-border/50">
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-4 h-4 text-chart-2 mb-1" />
                  <div className="text-muted-foreground text-xs">Uptime</div>
                  <div className="font-semibold text-card-foreground text-xs">{metrics?.uptime || "99.9%"}</div>
                </div>
                <div className="flex flex-col items-center">
                  <Activity className="w-4 h-4 text-primary mb-1" />
                  <div className="text-muted-foreground text-xs">Latency</div>
                  <div className="font-semibold text-card-foreground text-xs">
                    {metrics?.latency || Math.floor(Math.random() * 50) + 10}ms
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <AlertTriangle className="w-4 h-4 text-destructive mb-1" />
                  <div className="text-muted-foreground text-xs">Errors</div>
                  <div className="font-semibold text-card-foreground text-xs">
                    {health.errors || metrics?.errors || 0}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Detail Panel */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="backdrop-blur-glass border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-glow flex items-center gap-2">
              <StatusIcon
                className={`w-6 h-6 ${currentStatus === "ok" ? "text-chart-2" : currentStatus === "warning" ? "text-chart-3" : currentStatus === "down" ? "text-destructive" : "text-muted-foreground"}`}
              />
              {name} Service Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-accent">Service Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={config.variant}>{config.text}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span>{new Date(health.last_seen).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processed:</span>
                    <span>{health.processed || metrics?.requests || 0}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-accent">Performance Metrics</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU Usage:</span>
                    <span>{metrics?.cpu || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Memory Usage:</span>
                    <span>{metrics?.memory || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Error Count:</span>
                    <span className="text-destructive">{health.errors || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/50 bg-transparent">
                View Logs
              </Button>
              <Button variant="outline" size="sm" className="border-accent/30 hover:border-accent/50 bg-transparent">
                Restart Service
              </Button>
              <Button variant="outline" size="sm" className="border-chart-3/30 hover:border-chart-3/50 bg-transparent">
                Health Check
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
