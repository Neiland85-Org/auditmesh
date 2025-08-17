"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Line } from "@react-three/drei"
import { Suspense, useState, useRef, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type * as THREE from "three"

const microservices = [
  {
    id: 1,
    name: "Auth Service",
    status: "healthy",
    distance: 3,
    speed: 0.5,
    color: "#15803d",
    planetType: "rocky",
    size: 0.25,
    roughness: 0.8,
    metalness: 0.1,
  },
  {
    id: 2,
    name: "Payment Gateway",
    status: "warning",
    distance: 4,
    speed: 0.3,
    color: "#f59e0b",
    planetType: "desert",
    size: 0.3,
    roughness: 0.9,
    metalness: 0.05,
  },
  {
    id: 3,
    name: "Data Processor",
    status: "healthy",
    distance: 5,
    speed: 0.4,
    color: "#15803d",
    planetType: "ice",
    size: 0.28,
    roughness: 0.3,
    metalness: 0.7,
  },
  {
    id: 4,
    name: "Notification Hub",
    status: "critical",
    distance: 3.5,
    speed: 0.6,
    color: "#ef4444",
    planetType: "volcanic",
    size: 0.22,
    roughness: 0.7,
    metalness: 0.2,
  },
  {
    id: 5,
    name: "Analytics Engine",
    status: "healthy",
    distance: 4.5,
    speed: 0.35,
    color: "#15803d",
    planetType: "gas",
    size: 0.35,
    roughness: 0.4,
    metalness: 0.3,
  },
  {
    id: 6,
    name: "File Storage",
    status: "warning",
    distance: 2.5,
    speed: 0.7,
    color: "#f59e0b",
    planetType: "crystal",
    size: 0.26,
    roughness: 0.1,
    metalness: 0.9,
  },
]

// Audit events for Merkle chain timeline
const auditEvents = [
  { id: 1, timestamp: "2024-01-15T10:30:00Z", type: "Smart Contract Deploy", hash: "0x1a2b3c...", status: "verified" },
  { id: 2, timestamp: "2024-01-15T11:15:00Z", type: "Transaction Audit", hash: "0x4d5e6f...", status: "verified" },
  { id: 3, timestamp: "2024-01-15T12:00:00Z", type: "Security Scan", hash: "0x7g8h9i...", status: "warning" },
  { id: 4, timestamp: "2024-01-15T12:45:00Z", type: "Compliance Check", hash: "0xjklmno...", status: "verified" },
  { id: 5, timestamp: "2024-01-15T13:30:00Z", type: "Gas Optimization", hash: "0xpqrstu...", status: "critical" },
]

function OrbitingPlanet({ service, time }: { service: (typeof microservices)[0]; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const craterRefs = useRef<THREE.Mesh[]>([])

  const position = useMemo(() => {
    const angle = time * service.speed + service.id
    const x = Math.cos(angle) * service.distance
    const z = Math.sin(angle) * service.distance
    return [x, 0, z] as [number, number, number]
  }, [time, service])

  const craterPositions = useMemo(() => {
    const craters = []
    const numCraters = Math.floor(Math.random() * 5) + 3 // 3-7 craters per planet

    for (let i = 0; i < numCraters; i++) {
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const radius = service.size * 1.01 // Slightly above surface

      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(theta)

      craters.push({
        position: [x, y, z] as [number, number, number],
        size: Math.random() * 0.03 + 0.01,
        depth: Math.random() * 0.02 + 0.005,
      })
    }
    return craters
  }, [service.id, service.size])

  const getMaterialProps = () => {
    switch (service.planetType) {
      case "rocky":
        return {
          color: service.color,
          roughness: service.roughness,
          metalness: service.metalness,
          emissive: service.color,
          emissiveIntensity: 0.1,
        }
      case "desert":
        return {
          color: service.color,
          roughness: service.roughness,
          metalness: service.metalness,
          emissive: "#8B4513",
          emissiveIntensity: 0.05,
        }
      case "ice":
        return {
          color: "#87CEEB",
          roughness: service.roughness,
          metalness: service.metalness,
          emissive: "#B0E0E6",
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.9,
        }
      case "volcanic":
        return {
          color: "#8B0000",
          roughness: service.roughness,
          metalness: service.metalness,
          emissive: service.color,
          emissiveIntensity: 0.4,
        }
      case "gas":
        return {
          color: service.color,
          roughness: service.roughness,
          metalness: service.metalness,
          emissive: service.color,
          emissiveIntensity: 0.15,
          transparent: true,
          opacity: 0.8,
        }
      case "crystal":
        return {
          color: "#E6E6FA",
          roughness: service.roughness,
          metalness: service.metalness,
          emissive: service.color,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.85,
        }
      default:
        return {
          color: service.color,
          roughness: 0.5,
          metalness: 0.2,
          emissive: service.color,
          emissiveIntensity: 0.2,
        }
    }
  }

  return (
    <group>
      {/* Orbit path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[service.distance - 0.05, service.distance + 0.05, 64]} />
        <meshBasicMaterial color={service.color} transparent opacity={0.2} />
      </mesh>

      <group position={position}>
        {/* Main planet body */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[service.size, 32, 32]} />
          <meshStandardMaterial {...getMaterialProps()} />
        </mesh>

        {(service.planetType === "rocky" || service.planetType === "desert" || service.planetType === "volcanic") &&
          craterPositions.map((crater, index) => (
            <mesh key={index} position={crater.position}>
              <sphereGeometry args={[crater.size, 8, 8]} />
              <meshStandardMaterial
                color="#2D2D2D"
                roughness={0.9}
                metalness={0.1}
                emissive="#1A1A1A"
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}

        {service.planetType === "gas" && (
          <mesh>
            <sphereGeometry args={[service.size * 1.1, 16, 16]} />
            <meshBasicMaterial
              color={service.color}
              transparent
              opacity={0.1}
              side={2} // DoubleSide
            />
          </mesh>
        )}

        {service.planetType === "crystal" && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2
              const x = Math.cos(angle) * service.size * 0.8
              const z = Math.sin(angle) * service.size * 0.8
              return (
                <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
                  <coneGeometry args={[0.02, 0.08, 6]} />
                  <meshStandardMaterial
                    color="#E6E6FA"
                    roughness={0.1}
                    metalness={0.9}
                    emissive={service.color}
                    emissiveIntensity={0.2}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              )
            })}
          </>
        )}

        {/* Service label */}
        <Html distanceFactor={10} position={[0, service.size + 0.3, 0]}>
          <div className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-card-foreground border border-border">
            {service.name}
          </div>
        </Html>
      </group>
    </group>
  )
}

// Merkle Chain Timeline Component
function MerkleTimeline({
  events,
  onEventClick,
}: { events: typeof auditEvents; onEventClick: (event: (typeof auditEvents)[0]) => void }) {
  const points = useMemo(() => {
    if (!events || events.length === 0) return []

    return events.map((_, index) => {
      const x = index * 2 - (events.length - 1)
      const y = Math.sin(index * 0.5) * 0.5
      const z = 0
      return [x, y, z] as [number, number, number]
    })
  }, [events])

  if (!events || events.length === 0) return null

  return (
    <group position={[0, -2, 0]}>
      {/* Connection lines */}
      {points.length > 1 && <Line points={points} color="#6366f1" lineWidth={2} transparent opacity={0.6} />}

      {/* Event spheres */}
      {events.map((event, index) => {
        const color = event.status === "verified" ? "#15803d" : event.status === "warning" ? "#f59e0b" : "#ef4444"
        const point = points[index]

        if (!point) return null

        return (
          <mesh key={event.id} position={point} onClick={() => onEventClick(event)}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />

            <Html distanceFactor={8} position={[0, 0.3, 0]}>
              <div className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-card-foreground border border-border">
                {event.type}
              </div>
            </Html>
          </mesh>
        )
      })}
    </group>
  )
}

// Central AuditMesh Logo/Core
function AuditMeshCore() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <Html distanceFactor={15} position={[0, 1, 0]}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">AuditMesh</h1>
          <p className="text-sm text-muted-foreground">Blockchain Auditing Platform</p>
        </div>
      </Html>
    </group>
  )
}

// 3D Scene Component
function Scene3D({ onEventClick }: { onEventClick: (event: (typeof auditEvents)[0]) => void }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.01)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Central core */}
      <AuditMeshCore />

      {/* Orbiting microservices */}
      {microservices.map((service) => (
        <OrbitingPlanet key={service.id} service={service} time={time} />
      ))}

      {/* Merkle timeline */}
      <MerkleTimeline events={auditEvents} onEventClick={onEventClick} />

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}

export default function AuditMeshHero() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof auditEvents)[0] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "verified":
        return "bg-primary text-primary-foreground"
      case "warning":
        return "bg-secondary text-secondary-foreground"
      case "critical":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with 3D Scene */}
      <div className="relative h-screen w-full">
        <Canvas camera={{ position: [8, 4, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <Scene3D onEventClick={setSelectedEvent} />
          </Suspense>
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute top-8 left-8 z-10">
          <Card className="w-80 bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-sans">System Status</CardTitle>
              <CardDescription>Real-time microservices monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {microservices.map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{service.name}</span>
                  <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-8 right-8 z-10">
          <Card className="w-64 bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-sans text-lg">Audit Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start New Audit</Button>
              <Button variant="outline" className="w-full bg-transparent">
                View Reports
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="absolute top-8 right-8 z-10">
          <Card className="w-72 bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-sans text-sm">Interactive Guide</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>
                🌍 <strong>Planets:</strong> Microservices orbiting the core
              </p>
              <p>
                🔗 <strong>Timeline:</strong> Click spheres to view audit events
              </p>
              <p>
                🎮 <strong>Controls:</strong> Drag to rotate, scroll to zoom
              </p>
              <p>
                🎨 <strong>Colors:</strong> Green=Healthy, Yellow=Warning, Red=Critical
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans">Audit Event Details</DialogTitle>
            <DialogDescription>Event information from the blockchain audit trail</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Event Type</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.type}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Timestamp</h4>
                <p className="text-sm text-muted-foreground">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Transaction Hash</h4>
                <p className="text-sm font-mono text-muted-foreground">{selectedEvent.hash}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Status</h4>
                <Badge className={getStatusColor(selectedEvent.status)}>{selectedEvent.status}</Badge>
              </div>

              <div className="pt-4">
                <Button className="w-full" onClick={() => setSelectedEvent(null)}>
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
