"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, BarChart3, TrendingUp, Cpu, HardDrive, Network, Zap } from "lucide-react"
import * as THREE from "three"
import anime from "animejs"

interface MetricData {
  timestamp: string
  cpu: number
  memory: number
  requests: number
  latency: number
  errors: number
}

interface ServiceMetrics {
  [serviceName: string]: MetricData[]
}

interface LiveMetrics3DProps {
  services?: string[]
  maxDataPoints?: number
  pollInterval?: number
}

// 3D Wave/Bar visualization component
function MetricsWave({
  data,
  serviceName,
  metricType,
  color,
  position,
}: {
  data: MetricData[]
  serviceName: string
  metricType: keyof MetricData
  color: string
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometryRef = useRef<THREE.PlaneGeometry>(null)

  // Create wave geometry based on data
  const waveGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4, 2, 32, 16)
    const positions = geometry.attributes.position

    // Animate wave based on metric data
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const dataIndex = Math.floor(((x + 2) / 4) * (data.length - 1))
      const value = data[dataIndex] ? (data[dataIndex][metricType] as number) : 0
      const normalizedValue = metricType === "requests" ? Math.min(value / 1000, 2) : value / 100
      positions.setZ(i, Math.sin(x * 2) * normalizedValue * 0.5)
    }

    positions.needsUpdate = true
    return geometry
  }, [data, metricType])

  // Animate wave movement
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position
      const time = state.clock.elapsedTime

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const dataIndex = Math.floor(((x + 2) / 4) * (data.length - 1))
        const value = data[dataIndex] ? (data[dataIndex][metricType] as number) : 0
        const normalizedValue = metricType === "requests" ? Math.min(value / 1000, 2) : value / 100

        const wave = Math.sin(x * 2 + time) * normalizedValue * 0.3 + Math.sin(y * 3 + time * 0.5) * 0.1
        positions.setZ(i, wave)
      }

      positions.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={geometryRef} args={[4, 2, 32, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          wireframe={false}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Service label */}
      <Text position={[0, 0.5, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
        {serviceName}
      </Text>

      {/* Metric label */}
      <Text position={[0, 0.2, 0]} fontSize={0.15} color={color} anchorX="center" anchorY="middle">
        {metricType.toUpperCase()}
      </Text>

      {/* Current value */}
      <Text position={[0, -0.1, 0]} fontSize={0.12} color="#9ca3af" anchorX="center" anchorY="middle">
        {data.length > 0
          ? `${data[data.length - 1][metricType]}${metricType === "latency" ? "ms" : metricType === "requests" ? "" : "%"}`
          : "0"}
      </Text>
    </group>
  )
}

// 3D Bar chart component
function MetricsBars({
  data,
  serviceName,
  position,
}: {
  data: MetricData[]
  serviceName: string
  position: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)

  // Animate bars based on latest data
  useFrame(() => {
    if (groupRef.current && data.length > 0) {
      const latest = data[data.length - 1]
      const children = groupRef.current.children

      // Animate CPU bar (index 0)
      if (children[0]) {
        const targetScale = latest.cpu / 100
        children[0].scale.lerp(new THREE.Vector3(1, targetScale, 1), 0.1)
      }

      // Animate Memory bar (index 1)
      if (children[1]) {
        const targetScale = latest.memory / 100
        children[1].scale.lerp(new THREE.Vector3(1, targetScale, 1), 0.1)
      }

      // Animate Requests bar (index 2)
      if (children[2]) {
        const targetScale = Math.min(latest.requests / 1000, 2)
        children[2].scale.lerp(new THREE.Vector3(1, targetScale, 1), 0.1)
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* CPU Bar */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#2d8fff" emissive="#2d8fff" emissiveIntensity={0.1} />
      </mesh>

      {/* Memory Bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.1} />
      </mesh>

      {/* Requests Bar */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.1} />
      </mesh>

      {/* Service label */}
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
        {serviceName}
      </Text>

      {/* Metric labels */}
      <Text position={[-1, -1.2, 0]} fontSize={0.1} color="#2d8fff" anchorX="center" anchorY="middle">
        CPU
      </Text>
      <Text position={[0, -1.2, 0]} fontSize={0.1} color="#34d399" anchorX="center" anchorY="middle">
        MEM
      </Text>
      <Text position={[1, -1.2, 0]} fontSize={0.1} color="#fbbf24" anchorX="center" anchorY="middle">
        REQ
      </Text>
    </group>
  )
}

// Main 3D Scene
function LiveMetrics3DScene({
  metricsData,
  visualizationType,
}: {
  metricsData: ServiceMetrics
  visualizationType: "wave" | "bars"
}) {
  const services = Object.keys(metricsData)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#2d8fff" />
      <pointLight position={[-10, 10, -10]} intensity={0.4} color="#34d399" />
      <pointLight position={[0, -10, 10]} intensity={0.3} color="#fbbf24" />

      {/* Render visualizations for each service */}
      {services.map((service, index) => {
        const position: [number, number, number] = [(index - services.length / 2) * 6, 0, 0]

        if (visualizationType === "wave") {
          return (
            <group key={service}>
              <MetricsWave
                data={metricsData[service]}
                serviceName={service}
                metricType="cpu"
                color="#2d8fff"
                position={[position[0], 1, position[2]]}
              />
              <MetricsWave
                data={metricsData[service]}
                serviceName={service}
                metricType="memory"
                color="#34d399"
                position={[position[0], 0, position[2]]}
              />
              <MetricsWave
                data={metricsData[service]}
                serviceName={service}
                metricType="requests"
                color="#fbbf24"
                position={[position[0], -1, position[2]]}
              />
            </group>
          )
        } else {
          return <MetricsBars key={service} data={metricsData[service]} serviceName={service} position={position} />
        }
      })}

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={false}
      />
    </>
  )
}

// 2D Fallback component
function MetricsFallback({ metricsData }: { metricsData: ServiceMetrics }) {
  const services = Object.keys(metricsData)

  // Prepare data for charts
  const chartData = useMemo(() => {
    const maxLength = Math.max(...services.map((s) => metricsData[s].length))
    return Array.from({ length: maxLength }, (_, i) => {
      const dataPoint: any = { index: i }
      services.forEach((service) => {
        const serviceData = metricsData[service]
        if (serviceData[i]) {
          dataPoint[`${service}_cpu`] = serviceData[i].cpu
          dataPoint[`${service}_memory`] = serviceData[i].memory
          dataPoint[`${service}_requests`] = serviceData[i].requests
        }
      })
      return dataPoint
    })
  }, [metricsData, services])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Chart */}
        <div className="bg-card/50 p-4 rounded-lg border border-primary/20">
          <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            CPU Usage
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(6, 8, 25, 0.9)",
                  border: "1px solid rgba(45, 143, 255, 0.3)",
                  borderRadius: "8px",
                }}
              />
              {services.map((service, index) => (
                <Area
                  key={service}
                  type="monotone"
                  dataKey={`${service}_cpu`}
                  stackId="1"
                  stroke={index === 0 ? "#2d8fff" : index === 1 ? "#34d399" : "#fbbf24"}
                  fill={index === 0 ? "#2d8fff" : index === 1 ? "#34d399" : "#fbbf24"}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Chart */}
        <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
          <h3 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Memory Usage
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(6, 8, 25, 0.9)",
                  border: "1px solid rgba(52, 211, 153, 0.3)",
                  borderRadius: "8px",
                }}
              />
              {services.map((service, index) => (
                <Area
                  key={service}
                  type="monotone"
                  dataKey={`${service}_memory`}
                  stackId="1"
                  stroke={index === 0 ? "#2d8fff" : index === 1 ? "#34d399" : "#fbbf24"}
                  fill={index === 0 ? "#2d8fff" : index === 1 ? "#34d399" : "#fbbf24"}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Requests Chart */}
        <div className="bg-card/50 p-4 rounded-lg border border-chart-3/20">
          <h3 className="text-sm font-semibold text-chart-3 mb-2 flex items-center gap-2">
            <Network className="w-4 h-4" />
            Requests
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(6, 8, 25, 0.9)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  borderRadius: "8px",
                }}
              />
              {services.map((service, index) => (
                <Area
                  key={service}
                  type="monotone"
                  dataKey={`${service}_requests`}
                  stackId="1"
                  stroke={index === 0 ? "#2d8fff" : index === 1 ? "#34d399" : "#fbbf24"}
                  fill={index === 0 ? "#2d8fff" : index === 1 ? "#34d399" : "#fbbf24"}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function LiveMetrics3D({
  services = ["ms-gateway", "ms-lie-detector", "ms-auditor"],
  maxDataPoints = 50,
  pollInterval = 2000,
}: LiveMetrics3DProps) {
  const [metricsData, setMetricsData] = useState<ServiceMetrics>({})
  const [visualizationType, setVisualizationType] = useState<"wave" | "bars">("wave")
  const [use3D, setUse3D] = useState(true)
  const [isPolling, setIsPolling] = useState(true)
  const metricsRef = useRef<HTMLDivElement>(null)

  // Entry animation
  useEffect(() => {
    if (metricsRef.current) {
      anime({
        targets: metricsRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 700,
        easing: "easeOutExpo",
        delay: 500,
      })
    }
  }, [])

  // Polling for real-time data
  useEffect(() => {
    const fetchMetrics = async () => {
      const newData: ServiceMetrics = {}

      for (const service of services) {
        try {
          // Mock API call - replace with actual endpoint
          const response = await fetch(`/api/health/${service}`)
          let serviceData: MetricData

          if (response.ok) {
            const healthData = await response.json()
            serviceData = {
              timestamp: new Date().toISOString(),
              cpu: healthData.cpu || Math.random() * 100,
              memory: healthData.memory || Math.random() * 100,
              requests: healthData.requests || Math.floor(Math.random() * 1000),
              latency: healthData.latency || Math.floor(Math.random() * 200),
              errors: healthData.errors || Math.floor(Math.random() * 10),
            }
          } else {
            // Mock data for demo
            serviceData = {
              timestamp: new Date().toISOString(),
              cpu: Math.random() * 100,
              memory: Math.random() * 100,
              requests: Math.floor(Math.random() * 1000),
              latency: Math.floor(Math.random() * 200),
              errors: Math.floor(Math.random() * 10),
            }
          }

          newData[service] = [...(metricsData[service] || []).slice(-(maxDataPoints - 1)), serviceData]
        } catch (error) {
          console.error(`Failed to fetch metrics for ${service}:`, error)
        }
      }

      setMetricsData(newData)
    }

    fetchMetrics() // Initial fetch

    if (isPolling) {
      const interval = setInterval(fetchMetrics, pollInterval)
      return () => clearInterval(interval)
    }
  }, [services, maxDataPoints, pollInterval, isPolling, metricsData])

  // Check WebGL support
  const supportsWebGL = useMemo(() => {
    try {
      const canvas = document.createElement("canvas")
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    } catch {
      return false
    }
  }, [])

  const hasData = Object.keys(metricsData).length > 0

  return (
    <Card
      ref={metricsRef}
      className="backdrop-blur-glass border-primary/20"
      style={{
        background: "rgba(6, 8, 25, 0.6)",
        boxShadow: "0 0 15px rgba(45, 143, 255, 0.1)",
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif text-lg text-glow flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Live Metrics 3D
            </CardTitle>
            <p className="text-sm text-muted-foreground">Real-time performance visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isPolling ? "default" : "secondary"} className="text-xs">
              {isPolling ? "LIVE" : "PAUSED"}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant={use3D ? "default" : "outline"}
                size="sm"
                onClick={() => setUse3D(true)}
                disabled={!supportsWebGL}
                className="text-xs"
              >
                3D
              </Button>
              <Button
                variant={!use3D ? "default" : "outline"}
                size="sm"
                onClick={() => setUse3D(false)}
                className="text-xs"
              >
                2D
              </Button>
            </div>
            {use3D && (
              <div className="flex gap-1">
                <Button
                  variant={visualizationType === "wave" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVisualizationType("wave")}
                  className="text-xs"
                >
                  <TrendingUp className="w-3 h-3" />
                </Button>
                <Button
                  variant={visualizationType === "bars" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVisualizationType("bars")}
                  className="text-xs"
                >
                  <BarChart3 className="w-3 h-3" />
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsPolling(!isPolling)} className="text-xs">
              {isPolling ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
              <p>Loading metrics data...</p>
              <p className="text-xs">Polling services every {pollInterval / 1000}s</p>
            </div>
          </div>
        ) : use3D && supportsWebGL ? (
          <div className="h-80">
            <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
              <LiveMetrics3DScene metricsData={metricsData} visualizationType={visualizationType} />
            </Canvas>
          </div>
        ) : (
          <MetricsFallback metricsData={metricsData} />
        )}
      </CardContent>
    </Card>
  )
}
