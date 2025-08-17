"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useServiceHealth, type ServiceHealth, type ServiceStatus } from "@/hooks/use-service-health"
import { Activity, Database, Shield, Clock, TrendingUp, Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface ServiceCard3DProps {
  name: string
  serviceUrl: string
  subtitle?: string
  icon?: React.ReactNode
  onClick?: (health: ServiceHealth) => void
  className?: string
}

const statusConfig = {
  ok: {
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    pulseColor: "bg-green-400",
    icon: <Wifi size={16} />,
  },
  warning: {
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pulseColor: "bg-yellow-400",
    icon: <AlertTriangle size={16} />,
  },
  down: {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    pulseColor: "bg-red-400",
    icon: <WifiOff size={16} />,
  },
  unknown: {
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    pulseColor: "bg-gray-400",
    icon: <Clock size={16} />,
  },
}

const getServiceIcon = (name: string) => {
  if (!name) return <TrendingUp size={20} />

  const lowerName = name.toLowerCase()
  if (lowerName.includes("gateway")) return <Shield size={20} />
  if (lowerName.includes("detector")) return <Activity size={20} />
  if (lowerName.includes("auditor")) return <Database size={20} />
  return <TrendingUp size={20} />
}

export function ServiceCard3D({ name, serviceUrl, subtitle, icon, onClick, className = "" }: ServiceCard3DProps) {
  const { health, isLoading, error } = useServiceHealth(serviceUrl)
  const [previousStatus, setPreviousStatus] = useState<ServiceStatus>("unknown")
  const [showPulse, setShowPulse] = useState(false)

  // Detect status changes for pulse animation
  useEffect(() => {
    if (health.status !== previousStatus && previousStatus !== "unknown") {
      setShowPulse(true)
      setTimeout(() => setShowPulse(false), 2000)
    }
    setPreviousStatus(health.status)
  }, [health.status, previousStatus])

  const config = statusConfig[health.status]
  const serviceIcon = icon || getServiceIcon(name || "Unknown Service")

  const handleClick = () => {
    onClick?.(health)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`perspective-1000 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card
        className="relative p-6 bg-glass border-glass-border hover:shadow-glow transition-all duration-300 cursor-pointer group"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`${name} service status: ${health.status}`}
      >
        {/* Status Pulse Animation */}
        {showPulse && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={`absolute top-4 right-4 w-3 h-3 rounded-full ${config.pulseColor}`}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 bg-primary/20 rounded-lg text-primary group-hover:bg-primary/30 transition-colors"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
            >
              {serviceIcon}
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name || "Unknown Service"}
              </h3>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={isLoading ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              className={`p-1 rounded-full ${config.color}`}
            >
              {config.icon}
            </motion.div>
            <Badge variant="outline" className={config.color}>
              {health.status}
            </Badge>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-card/30 rounded-lg">
            <p className="text-2xl font-bold text-foreground">{health.kpis.processed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Processed</p>
          </div>
          <div className="text-center p-3 bg-card/30 rounded-lg">
            <p className="text-2xl font-bold text-foreground">{health.kpis.consumed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Consumed</p>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={14} />
            <span>Uptime: {health.uptime.toFixed(1)}%</span>
          </div>
          <div className="text-muted-foreground">{health.responseTime}ms</div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </Card>
    </motion.div>
  )
}

export default ServiceCard3D
