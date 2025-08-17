"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sun,
  Moon,
  Shield,
  Activity,
  Database,
  ExternalLink,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
} from "lucide-react"
import LieDetectorButton from "./lie-detector-button"
import { AnimatedText } from "./animated-text"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AppShellProps {
  children: React.ReactNode
}

interface NotificationProps {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  duration?: number
}

interface StatsCounterProps {
  label: string
  value: number
  icon: React.ReactNode
  trend?: "up" | "down" | "stable"
}

const StatsCounter = ({ label, value, icon, trend = "stable" }: StatsCounterProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-3 p-4 bg-glass rounded-xl"
  >
    <div className="p-2 bg-primary/20 rounded-lg text-primary">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
    {trend !== "stable" && (
      <div
        className={`text-xs px-2 py-1 rounded-full ${
          trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}
      >
        {trend === "up" ? "↗" : "↘"}
      </div>
    )}
  </motion.div>
)

const NotificationSlot = ({
  notifications,
  onDismiss,
}: {
  notifications: NotificationProps[]
  onDismiss: (id: string) => void
}) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence>
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          className="bg-glass rounded-xl p-4 max-w-sm shadow-glow"
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-1 rounded-full ${
                notification.type === "success"
                  ? "text-green-400"
                  : notification.type === "warning"
                    ? "text-yellow-400"
                    : notification.type === "error"
                      ? "text-red-400"
                      : "text-blue-400"
              }`}
            >
              {notification.type === "success" && <CheckCircle size={20} />}
              {notification.type === "warning" && <AlertTriangle size={20} />}
              {notification.type === "error" && <X size={20} />}
              {notification.type === "info" && <Info size={20} />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(notification.id)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </Button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)

const AppShell = ({ children }: AppShellProps) => {
  const [isDark, setIsDark] = useState(false)
  const [notifications, setNotifications] = useState<NotificationProps[]>([])
  const pathname = usePathname()

  // Mock stats data
  const stats = [
    { label: "Active Services", value: 12, icon: <Database size={20} />, trend: "up" as const },
    { label: "Events Today", value: 2847, icon: <Activity size={20} />, trend: "up" as const },
    { label: "Security Score", value: 98, icon: <Shield size={20} />, trend: "stable" as const },
  ]

  const externalServices = [
    { name: "Redpanda", url: "https://redpanda.com", status: "online" },
    { name: "Jaeger", url: "https://jaegertracing.io", status: "online" },
    { name: "MinIO", url: "https://min.io", status: "maintenance" },
  ]

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const addNotification = (notification: Omit<NotificationProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    setNotifications((prev) => [...prev, newNotification])

    // Auto-dismiss after duration
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, notification.duration || 5000)
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Demo notification on mount
  useEffect(() => {
    setTimeout(() => {
      addNotification({
        type: "success",
        title: "System Online",
        message: "All audit services are running normally",
        duration: 4000,
      })
    }, 2000)
  }, [])

  return (
    <div className="min-h-screen bg-brand-gradient bg-grid-pattern">
      {/* Glassmorphism Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 bg-glass border-b border-glass-border"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <AnimatedText
                  text="AuditMesh"
                  className="text-xl font-bold text-foreground"
                  animation="glow"
                  delay={500}
                />
                <p className="text-xs text-muted-foreground">Realtime Audit & Proofs</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={pathname === "/" ? "default" : "ghost"}
                  size="sm"
                  className={
                    pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"
                  }
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant={pathname === "/demo" ? "default" : "ghost"}
                  size="sm"
                  className={
                    pathname === "/demo" ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"
                  }
                >
                  Demo
                </Button>
              </Link>
              <Link href="/settings">
                <Button
                  variant={pathname === "/settings" ? "default" : "ghost"}
                  size="sm"
                  className={
                    pathname === "/settings"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary"
                  }
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              </Link>
            </div>

            {/* External Services */}
            <div className="hidden lg:flex items-center gap-4">
              {externalServices.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-glass rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary">{service.name}</span>
                  <Badge variant={service.status === "online" ? "default" : "secondary"} className="text-xs">
                    {service.status}
                  </Badge>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary" />
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="p-2 bg-glass hover:bg-primary/10"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {pathname === "/" && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              {/* Main Heading */}
              <AnimatedText
                text="Enterprise Audit Platform"
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                animation="staggerLetters"
                delay={800}
              />
              {/* Subtitle */}
              <AnimatedText
                text="Real-time monitoring, comprehensive audit trails, and cryptographic proofs for enterprise-grade security and compliance."
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                animation="typewriter"
                delay={2000}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <StatsCounter {...stat} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 gap-6"
        >
          {pathname === "/" ? (
            <Card className="p-6 bg-glass border-glass-border rounded-2xl shadow-glow">{children}</Card>
          ) : (
            children
          )}
        </motion.div>
      </main>

      {/* Notification Slot */}
      <NotificationSlot notifications={notifications} onDismiss={dismissNotification} />

      <LieDetectorButton
        onPurchase={() => {
          addNotification({
            type: "success",
            title: "Créditos Recargados",
            message: "¡Detector de mentiras reactivado con éxito!",
            duration: 3000,
          })
        }}
      />
    </div>
  )
}

export { AppShell }
export default AppShell
