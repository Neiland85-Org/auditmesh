"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  X,
  Zap,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
  Users,
  Building2,
  Database,
  Webhook,
  Key,
  Activity,
} from "lucide-react"

interface CRMIntegrationDashboardProps {
  isOpen: boolean
  onClose: () => void
  onConnect?: (crmName: string) => void
}

interface CRMProvider {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: "connected" | "available" | "premium"
  apiEndpoint: string
  features: string[]
  targetMarket: string
  pricing: string
}

const crmProviders: CRMProvider[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Complete CRM platform for growing businesses",
    icon: <Building2 className="text-orange-500" size={24} />,
    status: "available",
    apiEndpoint: "https://api.hubapi.com/crm/v3/",
    features: ["Contact Management", "Deal Tracking", "Email Integration", "Behavior Analytics"],
    targetMarket: "SMEs & Large Companies",
    pricing: "Free - €890/month",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "World's #1 CRM platform for enterprise sales",
    icon: <Database className="text-blue-500" size={24} />,
    status: "premium",
    apiEndpoint: "https://your-instance.salesforce.com/services/data/v58.0/",
    features: ["Advanced Analytics", "Custom Objects", "Workflow Automation", "AI Insights"],
    targetMarket: "Large Companies",
    pricing: "€25 - €300/user/month",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sales CRM designed for small and medium businesses",
    icon: <Activity className="text-green-500" size={24} />,
    status: "connected",
    apiEndpoint: "https://api.pipedrive.com/v1/",
    features: ["Pipeline Management", "Activity Tracking", "Email Sync", "Mobile App"],
    targetMarket: "SMEs",
    pricing: "€14.90 - €99/user/month",
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Comprehensive CRM for businesses of all sizes",
    icon: <Users className="text-red-500" size={24} />,
    status: "available",
    apiEndpoint: "https://www.zohoapis.com/crm/v2/",
    features: ["Lead Management", "Sales Automation", "Analytics", "Social CRM"],
    targetMarket: "SMEs & Large Companies",
    pricing: "€12 - €45/user/month",
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Work management platform with CRM capabilities",
    icon: <Webhook className="text-purple-500" size={24} />,
    status: "available",
    apiEndpoint: "https://api.monday.com/v2/",
    features: ["Project Management", "Team Collaboration", "Custom Workflows", "Time Tracking"],
    targetMarket: "SMEs",
    pricing: "€8 - €16/user/month",
  },
  {
    id: "freshworks",
    name: "Freshworks CRM",
    description: "AI-powered CRM for modern businesses",
    icon: <Shield className="text-teal-500" size={24} />,
    status: "premium",
    apiEndpoint: "https://domain.freshsales.io/api/",
    features: ["AI-Powered Insights", "Lead Scoring", "Email Campaigns", "Phone Integration"],
    targetMarket: "SMEs & Large Companies",
    pricing: "€15 - €69/user/month",
  },
]

export default function CRMIntegrationDashboard({ isOpen, onClose, onConnect }: CRMIntegrationDashboardProps) {
  const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (crmId: string) => {
    setIsConnecting(true)
    // Simulate API connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    onConnect?.(crmId)
    // Update status to connected (in real app, this would come from backend)
  }

  const getStatusBadge = (status: CRMProvider["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle size={12} className="mr-1" />
            Connected
          </Badge>
        )
      case "premium":
        return (
          <Badge className="bg-purple-500 text-white">
            <Zap size={12} className="mr-1" />
            Premium
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertCircle size={12} className="mr-1" />
            Available
          </Badge>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-glass rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-glass-border shadow-glow"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                >
                  <Eye className="text-white" size={24} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">CRM Behavior Scanner</h2>
                  <p className="text-muted-foreground">Connect to your CRM to detect suspicious behaviors</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            {/* Alert Banner */}
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                  "0 0 30px rgba(239, 68, 68, 0.6)",
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="mb-6 p-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-red-400/50 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <Shield className="text-red-400 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-red-400 text-lg mb-2">🔍 ADVANCED THREAT DETECTION</h3>
                  <p className="text-foreground font-semibold leading-relaxed">
                    Monitor employee interactions, detect lies, identify toxic behaviors, and prevent workplace
                    espionage across your CRM data in real-time.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CRM Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {crmProviders.map((crm, index) => (
                <motion.div
                  key={crm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCRM(selectedCRM === crm.id ? null : crm.id)}
                >
                  <Card
                    className={`h-full transition-all duration-300 ${
                      selectedCRM === crm.id ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/25" : "hover:shadow-lg"
                    } ${crm.status === "connected" ? "bg-green-50 dark:bg-green-950/20" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {crm.icon}
                          <CardTitle className="text-lg">{crm.name}</CardTitle>
                        </div>
                        {getStatusBadge(crm.status)}
                      </div>
                      <CardDescription className="text-sm">{crm.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users size={12} />
                          <span>{crm.targetMarket}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Key size={12} />
                          <span>{crm.pricing}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {crm.features.slice(0, 2).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {crm.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{crm.features.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        variant={crm.status === "connected" ? "outline" : "default"}
                        disabled={isConnecting}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConnect(crm.id)
                        }}
                      >
                        {isConnecting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Settings size={14} />
                          </motion.div>
                        ) : crm.status === "connected" ? (
                          <>
                            <Settings size={14} className="mr-1" />
                            Configure
                          </>
                        ) : (
                          <>
                            <ExternalLink size={14} className="mr-1" />
                            Connect
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Configuration Panel */}
            <AnimatePresence>
              {selectedCRM && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-glass-border pt-6"
                >
                  <div className="bg-glass-light rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Settings size={20} />
                      Configure {crmProviders.find((c) => c.id === selectedCRM)?.name}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="api-key">API Key</Label>
                          <Input
                            id="api-key"
                            type="password"
                            placeholder="Enter your API key..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endpoint">API Endpoint</Label>
                          <Input
                            id="endpoint"
                            value={crmProviders.find((c) => c.id === selectedCRM)?.apiEndpoint || ""}
                            readOnly
                            className="mt-1 bg-muted"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label>Detection Features</Label>
                          <div className="mt-2 space-y-2">
                            {[
                              "Lie Detection",
                              "Toxic Behavior Analysis",
                              "Espionage Monitoring",
                              "Compliance Tracking",
                            ].map((feature) => (
                              <div key={feature} className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button className="flex-1" disabled={!apiKey}>
                        <Shield size={16} className="mr-2" />
                        Start Monitoring
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedCRM(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-glass-border text-center">
              <p className="text-sm text-muted-foreground">
                🔒 All connections are encrypted and GDPR compliant. Your CRM data remains secure.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
