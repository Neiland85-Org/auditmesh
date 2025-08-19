
"use client"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Clock, Database, Shield, Users } from "lucide-react"
import AppShell from "./components/AppShell"
import EventConsole from "./components/EventConsole"
import LiveMetrics from "./components/LiveMetrics"
import ServiceCard3D from "./components/ServiceCard"
import { AnimatedText } from "./components/v0dev/animated-text"
import { Badge } from "./components/v0dev/ui/badge"
import { Button } from "./components/v0dev/ui/button"
import { Card } from "./components/v0dev/ui/card"

export default function HomePage() {
  const recentEvents = [
    { id: 1, type: "audit", message: "User authentication verified", timestamp: "2 min ago", status: "success" },
    { id: 2, type: "security", message: "Anomaly detected in data access", timestamp: "5 min ago", status: "warning" },
    { id: 3, type: "system", message: "Backup completed successfully", timestamp: "12 min ago", status: "success" },
    { id: 4, type: "compliance", message: "Monthly compliance report generated", timestamp: "1 hour ago", status: "info" }
  ];
  const microservices = [
    {
      name: "Gateway Service",
      serviceUrl: "http://localhost:3000",
      subtitle: "API Gateway & Load Balancer",
    },
    {
      name: "Detector Service",
      serviceUrl: "http://localhost:3001",
      subtitle: "Anomaly Detection Engine",
    },
    {
      name: "Auditor Service",
      serviceUrl: "http://localhost:3002",
      subtitle: "Audit Trail Processor",
    },
  ];
  const handleServiceClick = (serviceUrl: string) => {
    window.open(serviceUrl, '_blank');
  };
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <AnimatedText
              text="Dashboard"
              className="text-3xl font-bold text-foreground"
              animation="staggerLetters"
              delay={200}
            />
            <p className="text-muted-foreground">Monitor your audit infrastructure in real-time</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 shadow-glow">Generate Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {microservices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard3D
                name={service.name}
                status="ok"
                subtitle={service.subtitle}
                onClick={() => handleServiceClick(service.serviceUrl)}
              />
            </motion.div>
          ))}
        </div>

        {/* LiveMetrics Dashboard */}
        <LiveMetrics />

        {/* Event Console */}
        <EventConsole />

        {/* Recent Events */}
        <Card className="p-6 bg-glass border-glass-border">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <AnimatedText
              text="Recent Events"
              className="text-xl font-semibold text-foreground"
              animation="fadeInUp"
              delay={100}
            />
          </div>
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border border-border/50"
              >
                <div
                  className={`p-1 rounded-full ${
                    event.status === "success"
                      ? "text-green-400"
                      : event.status === "warning"
                        ? "text-yellow-400"
                        : "text-blue-400"
                  }`}
                >
                  {event.status === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{event.message}</p>
                  <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-glass border-glass-border">
          <AnimatedText
            text="Quick Actions"
            className="text-xl font-semibold text-foreground mb-4"
            animation="fadeInUp"
            delay={150}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-card/30 hover:bg-primary/10 border-border/50"
            >
              <Users size={24} />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-card/30 hover:bg-primary/10 border-border/50"
            >
              <Shield size={24} />
              <span>Security Audit</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-card/30 hover:bg-primary/10 border-border/50"
            >
              <Database size={24} />
              <span>Data Export</span>
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
