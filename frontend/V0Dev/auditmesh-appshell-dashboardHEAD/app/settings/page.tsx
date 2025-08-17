"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Save, Download, Crown, Shield, Zap, Database, FileText, TrendingUp } from "lucide-react"

// Validation schemas
const endpointsSchema = z.object({
  gatewayUrl: z.string().url("Invalid URL format"),
  detectorUrl: z.string().url("Invalid URL format"),
  auditorUrl: z.string().url("Invalid URL format"),
  apiToken: z.string().min(1, "API token is required"),
})

const featuresSchema = z.object({
  enableEventPublishing: z.boolean(),
  enableLiveMetrics: z.boolean(),
  enableNotifications: z.boolean(),
  enableAdvancedAnalytics: z.boolean(),
})

type EndpointsForm = z.infer<typeof endpointsSchema>
type FeaturesForm = z.infer<typeof featuresSchema>

// Mock data for premium features
const errorTrendsData = [
  { date: "2024-01-01", gateway: 12, detector: 8, auditor: 3 },
  { date: "2024-01-02", gateway: 15, detector: 12, auditor: 5 },
  { date: "2024-01-03", gateway: 8, detector: 6, auditor: 2 },
  { date: "2024-01-04", gateway: 22, detector: 18, auditor: 7 },
  { date: "2024-01-05", gateway: 11, detector: 9, auditor: 4 },
  { date: "2024-01-06", gateway: 17, detector: 14, auditor: 6 },
  { date: "2024-01-07", gateway: 9, detector: 7, auditor: 3 },
]

const auditHistoryData = [
  {
    id: "001",
    timestamp: "2024-01-07 14:30:22",
    actor: "user@company.com",
    action: "CREATE_ORDER",
    status: "verified",
    risk: "low",
  },
  {
    id: "002",
    timestamp: "2024-01-07 14:28:15",
    actor: "admin@company.com",
    action: "DELETE_USER",
    status: "flagged",
    risk: "high",
  },
  {
    id: "003",
    timestamp: "2024-01-07 14:25:08",
    actor: "system",
    action: "BACKUP_DATA",
    status: "verified",
    risk: "low",
  },
  {
    id: "004",
    timestamp: "2024-01-07 14:22:33",
    actor: "user2@company.com",
    action: "UPDATE_PROFILE",
    status: "pending",
    risk: "medium",
  },
  {
    id: "005",
    timestamp: "2024-01-07 14:20:11",
    actor: "api_service",
    action: "SYNC_RECORDS",
    status: "verified",
    risk: "low",
  },
]

export default function SettingsPage() {
  const [saveMessage, setSaveMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Form handlers
  const endpointsForm = useForm<EndpointsForm>({
    resolver: zodResolver(endpointsSchema),
    defaultValues: {
      gatewayUrl: localStorage.getItem("VITE_GATEWAY_URL") || "http://localhost:3000",
      detectorUrl: localStorage.getItem("VITE_DETECTOR_URL") || "http://localhost:3001",
      auditorUrl: localStorage.getItem("VITE_AUDITOR_URL") || "http://localhost:3002",
      apiToken: localStorage.getItem("VITE_API_TOKEN") || "",
    },
  })

  const featuresForm = useForm<FeaturesForm>({
    resolver: zodResolver(featuresSchema),
    defaultValues: {
      enableEventPublishing: localStorage.getItem("VITE_ENABLE_EVENTS") === "true",
      enableLiveMetrics: localStorage.getItem("VITE_ENABLE_METRICS") === "true",
      enableNotifications: localStorage.getItem("VITE_ENABLE_NOTIFICATIONS") === "true",
      enableAdvancedAnalytics: localStorage.getItem("VITE_ENABLE_ANALYTICS") === "true",
    },
  })

  const onSaveEndpoints = (data: EndpointsForm) => {
    localStorage.setItem("VITE_GATEWAY_URL", data.gatewayUrl)
    localStorage.setItem("VITE_DETECTOR_URL", data.detectorUrl)
    localStorage.setItem("VITE_AUDITOR_URL", data.auditorUrl)
    localStorage.setItem("VITE_API_TOKEN", data.apiToken)
    setSaveMessage("Endpoints configuration saved successfully!")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const onSaveFeatures = (data: FeaturesForm) => {
    localStorage.setItem("VITE_ENABLE_EVENTS", data.enableEventPublishing.toString())
    localStorage.setItem("VITE_ENABLE_METRICS", data.enableLiveMetrics.toString())
    localStorage.setItem("VITE_ENABLE_NOTIFICATIONS", data.enableNotifications.toString())
    localStorage.setItem("VITE_ENABLE_ANALYTICS", data.enableAdvancedAnalytics.toString())
    setSaveMessage("Features configuration saved successfully!")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleExport = (format: "csv" | "pdf") => {
    alert(`Premium Feature: Export ${format.toUpperCase()} - Upgrade to unlock this feature!`)
  }

  const paginatedAudits = auditHistoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(auditHistoryData.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Settings & Premium</h1>
          <p className="text-blue-200">Configure your AuditMesh console and unlock premium features</p>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30"
            >
              {saveMessage}
            </motion.div>
          )}
        </motion.div>

        <Tabs defaultValue="configuration" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="configuration" className="data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="premium" className="data-[state=active]:bg-blue-600">
              <Crown className="w-4 h-4 mr-2" />
              Premium Features
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-blue-600">
              <Database className="w-4 h-4 mr-2" />
              Account & Billing
            </TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Endpoints Configuration */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      Service Endpoints
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Configure your microservice URLs and API authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={endpointsForm.handleSubmit(onSaveEndpoints)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="gatewayUrl" className="text-slate-200">
                          Gateway URL
                        </Label>
                        <Input
                          id="gatewayUrl"
                          {...endpointsForm.register("gatewayUrl")}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="http://localhost:3000"
                        />
                        {endpointsForm.formState.errors.gatewayUrl && (
                          <p className="text-red-400 text-sm">{endpointsForm.formState.errors.gatewayUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="detectorUrl" className="text-slate-200">
                          Detector URL
                        </Label>
                        <Input
                          id="detectorUrl"
                          {...endpointsForm.register("detectorUrl")}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="http://localhost:3001"
                        />
                        {endpointsForm.formState.errors.detectorUrl && (
                          <p className="text-red-400 text-sm">{endpointsForm.formState.errors.detectorUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="auditorUrl" className="text-slate-200">
                          Auditor URL
                        </Label>
                        <Input
                          id="auditorUrl"
                          {...endpointsForm.register("auditorUrl")}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="http://localhost:3002"
                        />
                        {endpointsForm.formState.errors.auditorUrl && (
                          <p className="text-red-400 text-sm">{endpointsForm.formState.errors.auditorUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apiToken" className="text-slate-200">
                          API Token
                        </Label>
                        <Input
                          id="apiToken"
                          type="password"
                          {...endpointsForm.register("apiToken")}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter your API token"
                        />
                        {endpointsForm.formState.errors.apiToken && (
                          <p className="text-red-400 text-sm">{endpointsForm.formState.errors.apiToken.message}</p>
                        )}
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Endpoints
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Features Configuration */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Feature Toggles
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Enable or disable specific functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={featuresForm.handleSubmit(onSaveFeatures)} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Event Publishing</Label>
                          <p className="text-sm text-slate-400">Allow publishing audit events</p>
                        </div>
                        <Switch
                          {...featuresForm.register("enableEventPublishing")}
                          defaultChecked={featuresForm.getValues("enableEventPublishing")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Live Metrics</Label>
                          <p className="text-sm text-slate-400">Real-time performance monitoring</p>
                        </div>
                        <Switch
                          {...featuresForm.register("enableLiveMetrics")}
                          defaultChecked={featuresForm.getValues("enableLiveMetrics")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Notifications</Label>
                          <p className="text-sm text-slate-400">Alert system for anomalies</p>
                        </div>
                        <Switch
                          {...featuresForm.register("enableNotifications")}
                          defaultChecked={featuresForm.getValues("enableNotifications")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200 flex items-center gap-2">
                            Advanced Analytics
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </Label>
                          <p className="text-sm text-slate-400">Premium analytics and insights</p>
                        </div>
                        <Switch
                          {...featuresForm.register("enableAdvancedAnalytics")}
                          defaultChecked={featuresForm.getValues("enableAdvancedAnalytics")}
                          disabled
                        />
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Features
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Premium Features Tab */}
          <TabsContent value="premium" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Error Trends Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Error Trends Analysis
                      <Crown className="w-4 h-4 text-yellow-400" />
                    </CardTitle>
                    <CardDescription className="text-slate-300">7-day error comparison across services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={errorTrendsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F9FAFB",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="gateway"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="url(#gradientGateway)"
                          />
                          <Area
                            type="monotone"
                            dataKey="detector"
                            stackId="1"
                            stroke="#10B981"
                            fill="url(#gradientDetector)"
                          />
                          <Area
                            type="monotone"
                            dataKey="auditor"
                            stackId="1"
                            stroke="#F59E0B"
                            fill="url(#gradientAuditor)"
                          />
                          <defs>
                            <linearGradient id="gradientGateway" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="gradientDetector" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="gradientAuditor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Audit History Table */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Audit History
                      <Crown className="w-4 h-4 text-yellow-400" />
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Recent audit events with risk assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleExport("csv")}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button
                        onClick={() => handleExport("pdf")}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">ID</TableHead>
                          <TableHead className="text-slate-300">Actor</TableHead>
                          <TableHead className="text-slate-300">Action</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Risk</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAudits.map((audit) => (
                          <TableRow key={audit.id} className="border-slate-700">
                            <TableCell className="text-slate-300 font-mono">{audit.id}</TableCell>
                            <TableCell className="text-slate-300">{audit.actor}</TableCell>
                            <TableCell className="text-slate-300">{audit.action}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  audit.status === "verified"
                                    ? "default"
                                    : audit.status === "flagged"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={
                                  audit.status === "verified"
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : audit.status === "flagged"
                                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                                      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                }
                              >
                                {audit.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  audit.risk === "low"
                                    ? "border-green-500/30 text-green-300"
                                    : audit.risk === "high"
                                      ? "border-red-500/30 text-red-300"
                                      : "border-yellow-500/30 text-yellow-300"
                                }
                              >
                                {audit.risk}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, auditHistoryData.length)} of {auditHistoryData.length}{" "}
                        entries
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Account & Billing Tab */}
          <TabsContent value="account" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-white flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    Upgrade to Premium
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Unlock advanced features and unlimited audit capacity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 p-4 border border-slate-600 rounded-lg">
                      <h3 className="text-lg font-semibold text-white">Free Plan</h3>
                      <div className="space-y-2 text-slate-300">
                        <p>✓ Basic audit logging</p>
                        <p>✓ 3 microservices</p>
                        <p>✓ 7-day history</p>
                        <p>✗ Advanced analytics</p>
                        <p>✗ Export reports</p>
                        <p>✗ Multi-user access</p>
                      </div>
                      <div className="text-2xl font-bold text-white">$0/month</div>
                    </div>

                    <div className="space-y-4 p-4 border-2 border-yellow-400 rounded-lg bg-yellow-400/5">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        Premium Plan
                        <Crown className="w-5 h-5 text-yellow-400" />
                      </h3>
                      <div className="space-y-2 text-slate-300">
                        <p>✓ Everything in Free</p>
                        <p>✓ Unlimited services</p>
                        <p>✓ 90-day history</p>
                        <p>✓ Advanced analytics</p>
                        <p>✓ CSV/PDF exports</p>
                        <p>✓ Multi-user access</p>
                        <p>✓ Priority support</p>
                      </div>
                      <div className="text-2xl font-bold text-white">$29/month</div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-3">
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Premium
                    </Button>
                    <p className="text-sm text-slate-400">30-day money-back guarantee • Cancel anytime</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
