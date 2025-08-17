"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Environment, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LiveMetricsData, HealthResponse } from "@/types/auditmesh"

function AnimatedBar({
  position,
  height,
  color,
  label,
  isPulsing,
}: {
  position: [number, number, number]
  height: number
  color: string
  label: string
  isPulsing: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef(0)

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth height animation
      const targetHeight = Math.max(0.1, height / 100)
      const currentScale = meshRef.current.scale.y
      meshRef.current.scale.y = THREE.MathUtils.lerp(currentScale, targetHeight, 0.1)

      // Pulse effect when data changes
      if (isPulsing) {
        pulseRef.current += 0.1
        const pulse = Math.sin(pulseRef.current) * 0.1 + 1
        meshRef.current.scale.x = pulse
        meshRef.current.scale.z = pulse
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1)
      }
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {label}
      </Text>
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {Math.round(height)}
      </Text>
    </group>
  )
}

function AnimatedWave({
  position,
  amplitude,
  color,
  label,
  isPulsing,
}: {
  position: [number, number, number]
  amplitude: number
  color: string
  label: string
  isPulsing: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Wave animation
      const time = state.clock.getElapsedTime()
      meshRef.current.rotation.z = Math.sin(time * 2) * 0.1

      // Pulse effect
      if (isPulsing) {
        const pulse = Math.sin(time * 8) * 0.3 + 0.7
        materialRef.current.emissiveIntensity = pulse
      } else {
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, 0.1, 0.1)
      }
    }
  })

  const waveHeight = Math.max(0.1, amplitude / 50)

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.6, 0.6, waveHeight, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {label}
      </Text>
      <Text
        position={[0, waveHeight + 0.5, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {Math.round(amplitude)}
      </Text>
    </group>
  )
}

function MetricsScene({
  metricsData,
  visualizationType,
  pulsingServices,
}: {
  metricsData: LiveMetricsData[]
  visualizationType: "bars" | "waves"
  pulsingServices: Set<string>
}) {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b9d" />

      {metricsData.map((data, index) => {
        const xPos = (index - metricsData.length / 2) * 3
        const isPulsing = pulsingServices.has(data.serviceId)

        if (visualizationType === "bars") {
          return (
            <group key={data.serviceId}>
              <AnimatedBar
                position={[xPos - 0.8, 0, 0]}
                height={data.processed}
                color="#06b6d4"
                label="Processed"
                isPulsing={isPulsing}
              />
              <AnimatedBar
                position={[xPos + 0.8, 0, 0]}
                height={data.consumed}
                color="#f59e0b"
                label="Consumed"
                isPulsing={isPulsing}
              />
              <Text
                position={[xPos, -2, 0]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Geist-Bold.ttf"
              >
                {data.serviceName}
              </Text>
            </group>
          )
        } else {
          return (
            <group key={data.serviceId}>
              <AnimatedWave
                position={[xPos - 1, 0, 0]}
                amplitude={data.processed}
                color="#06b6d4"
                label="Processed"
                isPulsing={isPulsing}
              />
              <AnimatedWave
                position={[xPos + 1, 0, 0]}
                amplitude={data.consumed}
                color="#f59e0b"
                label="Consumed"
                isPulsing={isPulsing}
              />
              <Text
                position={[xPos, -2.5, 0]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Geist-Bold.ttf"
              >
                {data.serviceName}
              </Text>
            </group>
          )
        }
      })}

      <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={15} />
    </>
  )
}

function Metrics2DFallback({
  metricsData,
  pulsingServices,
}: {
  metricsData: LiveMetricsData[]
  pulsingServices: Set<string>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {metricsData.map((data) => {
        const isPulsing = pulsingServices.has(data.serviceId)
        return (
          <Card
            key={data.serviceId}
            className={`transition-all duration-300 ${
              isPulsing ? "animate-pulse border-primary shadow-lg shadow-primary/20" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                {data.serviceName}
                <Badge variant={data.status === "ok" ? "default" : "destructive"}>{data.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processed</span>
                    <span className="font-mono text-cyan-400">{data.processed}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (data.processed / 1000) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Consumed</span>
                    <span className="font-mono text-amber-400">{data.consumed}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (data.consumed / 1000) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Last updated: {data.timestamp.toLocaleTimeString()}</div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function LiveMetrics3D({
  className = "",
}: {
  className?: string
}) {
  const [metricsData, setMetricsData] = useState<LiveMetricsData[]>([])
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [visualizationType, setVisualizationType] = useState<"bars" | "waves">("bars")
  const [pulsingServices, setPulsingServices] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setIsWebGLSupported(!!gl)
    } catch (e) {
      setIsWebGLSupported(false)
    }
  }, [])

  const fetchMetrics = async () => {
    try {
      const services = ["ms-lie-detector", "ms-auditor"]
      const promises = services.map(async (serviceId) => {
        try {
          // In a real implementation, these would be actual API calls
          // For demo purposes, we'll simulate the data
          const response = await new Promise<HealthResponse>((resolve) => {
            setTimeout(() => {
              resolve({
                status: "ok",
                metrics: {
                  processed: Math.floor(Math.random() * 1000) + 100,
                  consumed: Math.floor(Math.random() * 800) + 50,
                  uptime: Date.now(),
                },
              })
            }, Math.random() * 100) // Simulate network delay
          })

          return {
            serviceId,
            serviceName: serviceId
              .replace("ms-", "")
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            processed: response.metrics.processed,
            consumed: response.metrics.consumed,
            timestamp: new Date(),
            status: response.status as "ok" | "warning" | "error",
          } as LiveMetricsData
        } catch (error) {
          console.error(`[v0] Error fetching metrics for ${serviceId}:`, error)
          return null
        }
      })

      const results = await Promise.all(promises)
      const validResults = results.filter((result): result is LiveMetricsData => result !== null)

      if (validResults.length > 0) {
        // Check for changes to trigger pulse effect
        const changedServices = new Set<string>()
        validResults.forEach((newData) => {
          const oldData = metricsData.find((d) => d.serviceId === newData.serviceId)
          if (oldData && (oldData.processed !== newData.processed || oldData.consumed !== newData.consumed)) {
            changedServices.add(newData.serviceId)
          }
        })

        if (changedServices.size > 0) {
          setPulsingServices(changedServices)
          setTimeout(() => setPulsingServices(new Set()), 2000) // Clear pulse after 2 seconds
        }

        setMetricsData(validResults)
        setError(null)
      }
    } catch (error) {
      console.error("[v0] Error fetching metrics:", error)
      setError("Failed to fetch metrics data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 2000)
    return () => clearInterval(interval)
  }, [metricsData]) // Include metricsData in dependency to detect changes

  if (isLoading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading metrics...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`h-full ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Live Metrics 3D</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setVisualizationType("bars")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                visualizationType === "bars"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Bars
            </button>
            <button
              onClick={() => setVisualizationType("waves")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                visualizationType === "waves"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Waves
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        {!isWebGLSupported ? (
          <div className="h-full">
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-400">
                WebGL is not supported in your browser. Showing 2D fallback view.
              </p>
            </div>
            <Metrics2DFallback metricsData={metricsData} pulsingServices={pulsingServices} />
          </div>
        ) : (
          <div className="h-full w-full">
            <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
              <Suspense fallback={null}>
                <MetricsScene
                  metricsData={metricsData}
                  visualizationType={visualizationType}
                  pulsingServices={pulsingServices}
                />
              </Suspense>
            </Canvas>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
