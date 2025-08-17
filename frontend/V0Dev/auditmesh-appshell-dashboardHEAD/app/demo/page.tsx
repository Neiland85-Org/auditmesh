"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppShell } from "@/components/app-shell"
import { ServiceCard3D } from "@/components/service-card-3d"
import { LiveMetrics } from "@/components/live-metrics"
import { EventConsole3D } from "@/components/event-console-3d"
import { LieDetectorButton } from "@/components/lie-detector-button"
import { AnimatedText } from "@/components/animated-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, Settings, Database, Activity, Shield, HelpCircle, Zap } from "lucide-react"

const DEMO_SERVICES = [
  { name: "Gateway", url: "http://localhost:3000", description: "API Gateway & Load Balancer" },
  { name: "Detector", url: "http://localhost:3001", description: "Anomaly Detection Engine" },
  { name: "Auditor", url: "http://localhost:3002", description: "Audit Trail Processor" },
]

const DEMO_STEPS = [
  {
    id: "services",
    title: "Monitor Services",
    description: "Watch real-time health status of your microservices",
    icon: Activity,
    component: "ServiceCard3D",
  },
  {
    id: "metrics",
    title: "Live Metrics",
    description: "View forensic-style time series data and performance indicators",
    icon: Database,
    component: "LiveMetrics",
  },
  {
    id: "events",
    title: "Publish Events",
    description: "Create audit events and visualize the Merkle chain",
    icon: Shield,
    component: "EventConsole3D",
  },
  {
    id: "detector",
    title: "Lie Detection",
    description: "Interactive globe for detecting workplace toxicity",
    icon: Zap,
    component: "LieDetectorButton",
  },
]

export default function DemoPage() {
  const [mockDataEnabled, setMockDataEnabled] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  // Check environment variable for mock data preference
  useEffect(() => {
    const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== "false"
    setMockDataEnabled(enableMock)
  }, [])

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const nextStep = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AppShell>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Welcome Modal */}
          <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-500" />
                  Welcome to AuditMesh Demo
                </DialogTitle>
                <DialogDescription>
                  Experience the complete audit and monitoring platform. This demo showcases all features with
                  configurable data sources.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="mock-data" checked={mockDataEnabled} onCheckedChange={setMockDataEnabled} />
                  <Label htmlFor="mock-data">Use simulated data</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle between mock data and real API endpoints</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button onClick={() => setShowWelcome(false)} className="w-full">
                  Start Demo
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Demo Header */}
          <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <AnimatedText
                text="AuditMesh Demo"
                variant="stagger"
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
              />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Complete audit and monitoring platform demonstration
              </p>

              {/* Demo Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Badge variant={mockDataEnabled ? "default" : "secondary"}>
                  {mockDataEnabled ? "Simulated Data" : "Live Data"}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Demo Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demo Configuration</DialogTitle>
                      <DialogDescription>
                        Configure how the demo behaves and what data sources to use.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="demo-mock-data" checked={mockDataEnabled} onCheckedChange={setMockDataEnabled} />
                        <Label htmlFor="demo-mock-data">Enable mock data</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>Mock Data:</strong> Uses simulated responses for demonstration
                        </p>
                        <p>
                          <strong>Live Data:</strong> Connects to real endpoints (requires services running)
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            {/* Demo Progress */}
            <Card className="mb-8 glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Demo Progress
                </CardTitle>
                <CardDescription>Follow these steps to explore all AuditMesh features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {DEMO_STEPS.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === currentStep
                    const isCompleted = completedSteps.includes(step.id)

                    return (
                      <motion.div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          isActive
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : isCompleted
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : "border-muted bg-muted/50"
                        }`}
                        onClick={() => setCurrentStep(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            className={`h-5 w-5 ${
                              isActive ? "text-blue-500" : isCompleted ? "text-green-500" : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium text-sm">{step.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                    Previous
                  </Button>
                  <Button onClick={nextStep} disabled={currentStep === DEMO_STEPS.length - 1}>
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Content */}
            <div className="space-y-8">
              {/* Service Cards Section */}
              <AnimatePresence>
                {(currentStep === 0 || completedSteps.includes("services")) && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-6 w-6 text-blue-500" />
                      <h2 className="text-2xl font-bold">Service Monitoring</h2>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Real-time health monitoring of your microservices</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {DEMO_SERVICES.map((service) => (
                        <ServiceCard3D
                          key={service.name}
                          service={{
                            name: service.name,
                            url: service.url,
                            status: mockDataEnabled ? "ok" : "unknown",
                            responseTime: mockDataEnabled ? Math.floor(Math.random() * 100) + 50 : 0,
                            uptime: mockDataEnabled ? 99.5 + Math.random() * 0.5 : 0,
                            processed: mockDataEnabled ? Math.floor(Math.random() * 1000) + 500 : 0,
                            consumed: mockDataEnabled ? Math.floor(Math.random() * 800) + 400 : 0,
                          }}
                          onClick={() => handleStepComplete("services")}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Live Metrics Section */}
              <AnimatePresence>
                {(currentStep === 1 || completedSteps.includes("metrics")) && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Database className="h-6 w-6 text-blue-500" />
                      <h2 className="text-2xl font-bold">Live Metrics Dashboard</h2>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Forensic-style time series visualization with configurable intervals</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <LiveMetrics
                      services={DEMO_SERVICES.map((s) => s.url)}
                      onInteraction={() => handleStepComplete("metrics")}
                    />
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Event Console Section */}
              <AnimatePresence>
                {(currentStep === 2 || completedSteps.includes("events")) && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-6 w-6 text-blue-500" />
                      <h2 className="text-2xl font-bold">Event Console</h2>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Publish audit events and visualize the Merkle chain with 3D animations</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <EventConsole3D onEventPublished={() => handleStepComplete("events")} />
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Lie Detector Section */}
              <AnimatePresence>
                {(currentStep === 3 || completedSteps.includes("detector")) && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="h-6 w-6 text-blue-500" />
                      <h2 className="text-2xl font-bold">Lie Detection System</h2>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Interactive globe for detecting workplace toxicity and malpractice</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex justify-center">
                      <LieDetectorButton onInteraction={() => handleStepComplete("detector")} />
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            {/* Demo Completion */}
            {completedSteps.length === DEMO_STEPS.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 text-center"
              >
                <Card className="glass-card max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle className="text-green-600">Demo Complete!</CardTitle>
                    <CardDescription>You've explored all AuditMesh features. Ready for production?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => (window.location.href = "/settings")}>
                      Configure for Production
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setCompletedSteps([])
                        setCurrentStep(0)
                      }}
                    >
                      Restart Demo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </TooltipProvider>
    </AppShell>
  )
}
