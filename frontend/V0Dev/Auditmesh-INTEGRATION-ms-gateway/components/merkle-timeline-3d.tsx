"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Line } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GitBranch, Hash, Clock, User, FileText, Zap } from "lucide-react"
import * as THREE from "three"
import anime from "animejs"

interface TimelineEvent {
  event_id: string
  status: "pending" | "verified" | "failed"
  short: string
  timestamp: string
  action?: string
  actor?: any
  subject?: any
  payload?: any
  proof?: string[]
  root?: string
}

interface MerkleTimeline3DProps {
  events: TimelineEvent[]
  onEventSelect?: (event: TimelineEvent) => void
}

// 3D Sphere component for individual events
function EventSphere({
  event,
  position,
  isSelected,
  onClick,
}: {
  event: TimelineEvent
  position: [number, number, number]
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Get color based on event status
  const getEventColor = () => {
    switch (event.status) {
      case "verified":
        return "#34d399" // chart-2 green
      case "failed":
        return "#ef4444" // destructive red
      case "pending":
        return "#2d8fff" // primary blue
      default:
        return "#6b7280" // muted gray
    }
  }

  // Animate sphere on hover and selection
  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.3 : hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)

      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={getEventColor()}
          emissive={getEventColor()}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={getEventColor()} transparent opacity={isSelected ? 0.2 : hovered ? 0.15 : 0.05} />
      </mesh>

      {/* Event label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {event.short}
      </Text>

      {/* Timestamp */}
      <Text
        position={[0, -1.0, 0]}
        fontSize={0.1}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {new Date(event.timestamp).toLocaleTimeString()}
      </Text>
    </group>
  )
}

// Connection lines between events
function ConnectionLines({ events }: { events: TimelineEvent[] }) {
  const points = useMemo(() => {
    return events.map((_, index) => {
      const angle = (index / events.length) * Math.PI * 2
      const radius = 3
      return new THREE.Vector3(Math.cos(angle) * radius, (index - events.length / 2) * 0.5, Math.sin(angle) * radius)
    })
  }, [events])

  const linePoints = useMemo(() => {
    const allPoints: THREE.Vector3[] = []
    for (let i = 0; i < points.length - 1; i++) {
      allPoints.push(points[i], points[i + 1])
    }
    return allPoints
  }, [points])

  if (linePoints.length === 0) return null

  return <Line points={linePoints} color="#2d8fff" lineWidth={2} transparent opacity={0.6} />
}

// Main 3D Scene component
function Timeline3DScene({
  events,
  selectedEvent,
  onEventSelect,
}: {
  events: TimelineEvent[]
  selectedEvent: TimelineEvent | null
  onEventSelect: (event: TimelineEvent) => void
}) {
  const { camera } = useThree()

  // Position events in a spiral pattern
  const eventPositions = useMemo(() => {
    return events.map((_, index) => {
      const angle = (index / events.length) * Math.PI * 2
      const radius = 3
      const height = (index - events.length / 2) * 0.5
      return [Math.cos(angle) * radius, height, Math.sin(angle) * radius] as [number, number, number]
    })
  }, [events])

  // Auto-focus on selected event
  useEffect(() => {
    if (selectedEvent) {
      const index = events.findIndex((e) => e.event_id === selectedEvent.event_id)
      if (index !== -1 && eventPositions[index]) {
        const [x, y, z] = eventPositions[index]
        anime({
          targets: camera.position,
          x: x * 1.5,
          y: y + 2,
          z: z * 1.5,
          duration: 1000,
          easing: "easeOutCubic",
        })
      }
    }
  }, [selectedEvent, events, eventPositions, camera])

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#2d8fff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#34d399" />

      {/* Connection lines */}
      <ConnectionLines events={events} />

      {/* Event spheres */}
      {events.map((event, index) => (
        <EventSphere
          key={event.event_id}
          event={event}
          position={eventPositions[index]}
          isSelected={selectedEvent?.event_id === event.event_id}
          onClick={() => onEventSelect(event)}
        />
      ))}

      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        autoRotate={events.length > 0}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function MerkleTimeline3D({ events, onEventSelect }: MerkleTimeline3DProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Entry animation
  useEffect(() => {
    if (timelineRef.current) {
      anime({
        targets: timelineRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 700,
        easing: "easeOutExpo",
        delay: 400,
      })
    }
  }, [])

  const handleEventSelect = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setIsDetailOpen(true)
    onEventSelect?.(event)
  }

  const getStatusIcon = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "verified":
        return <Hash className="w-4 h-4 text-chart-2" />
      case "failed":
        return <Zap className="w-4 h-4 text-destructive" />
      case "pending":
        return <Clock className="w-4 h-4 text-primary animate-pulse" />
    }
  }

  const getStatusColor = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "verified":
        return "border-chart-2/50 bg-chart-2/10"
      case "failed":
        return "border-destructive/50 bg-destructive/10"
      case "pending":
        return "border-primary/50 bg-primary/10"
    }
  }

  return (
    <>
      <Card
        ref={timelineRef}
        className="backdrop-blur-glass border-accent/20 h-96"
        style={{
          background: "rgba(6, 8, 25, 0.6)",
          boxShadow: "0 0 15px rgba(52, 211, 153, 0.1)",
        }}
      >
        <CardHeader>
          <CardTitle className="font-serif text-lg text-glow flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-accent" />
            Merkle Timeline 3D
          </CardTitle>
          <p className="text-sm text-muted-foreground">Interactive 3D visualization of the audit event chain</p>
        </CardHeader>
        <CardContent className="h-80">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No events in timeline yet</p>
                <p className="text-xs">Submit events to see the 3D chain</p>
              </div>
            </div>
          ) : (
            <Canvas camera={{ position: [5, 2, 5], fov: 60 }}>
              <Timeline3DScene events={events} selectedEvent={selectedEvent} onEventSelect={handleEventSelect} />
            </Canvas>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="backdrop-blur-glass border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-glow flex items-center gap-2">
              {selectedEvent && getStatusIcon(selectedEvent.status)}
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${getStatusColor(selectedEvent.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-medium">{selectedEvent.event_id}</span>
                  <Badge variant={selectedEvent.status === "verified" ? "default" : "secondary"}>
                    {selectedEvent.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(selectedEvent.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-accent flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Event Data
                  </h3>
                  <div className="space-y-1 text-sm">
                    {selectedEvent.action && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Action:</span>
                        <span className="font-mono">{selectedEvent.action}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Short:</span>
                      <span>{selectedEvent.short}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-accent flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Cryptographic Proof
                  </h3>
                  <div className="space-y-1 text-sm">
                    {selectedEvent.root && (
                      <div>
                        <span className="text-muted-foreground">Root Hash:</span>
                        <div className="font-mono text-xs bg-muted/20 p-2 rounded mt-1 break-all">
                          {selectedEvent.root}
                        </div>
                      </div>
                    )}
                    {selectedEvent.proof && selectedEvent.proof.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Proof Chain:</span>
                        <div className="space-y-1 mt-1">
                          {selectedEvent.proof.slice(0, 3).map((hash, index) => (
                            <div key={index} className="font-mono text-xs bg-muted/20 p-1 rounded break-all">
                              {hash}
                            </div>
                          ))}
                          {selectedEvent.proof.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{selectedEvent.proof.length - 3} more hashes
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Raw data sections */}
              {(selectedEvent.actor || selectedEvent.subject || selectedEvent.payload) && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-accent flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Raw Event Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedEvent.actor && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Actor</div>
                        <pre className="text-xs bg-muted/20 p-2 rounded overflow-auto max-h-20">
                          {JSON.stringify(selectedEvent.actor, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedEvent.subject && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Subject</div>
                        <pre className="text-xs bg-muted/20 p-2 rounded overflow-auto max-h-20">
                          {JSON.stringify(selectedEvent.subject, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedEvent.payload && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Payload</div>
                        <pre className="text-xs bg-muted/20 p-2 rounded overflow-auto max-h-20">
                          {JSON.stringify(selectedEvent.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 hover:border-primary/50 bg-transparent"
                >
                  Verify Proof
                </Button>
                <Button variant="outline" size="sm" className="border-accent/30 hover:border-accent/50 bg-transparent">
                  Export Event
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-chart-3/30 hover:border-chart-3/50 bg-transparent"
                >
                  View Chain
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
