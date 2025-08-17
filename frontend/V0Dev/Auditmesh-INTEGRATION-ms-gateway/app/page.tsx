"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import ServiceCard3D from "@/components/service-card-3d"
import Scene3D from "@/components/scene-3d"
import HeadBar3D from "@/components/head-bar-3d"
import EventConsole3D from "@/components/event-console-3d"
import MerkleTimeline3D from "@/components/merkle-timeline-3d"
import LiveMetrics3D from "@/components/live-metrics-3d"

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

export default function AuditMeshDashboard() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  const handleEventCreated = (orb: any) => {
    const newEvent: TimelineEvent = {
      event_id: orb.id,
      status: "pending",
      short: `${JSON.parse(orb.data.actor).user_id || "user"}.${orb.data.action}`,
      timestamp: orb.timestamp.toISOString(),
      action: orb.data.action,
      actor: JSON.parse(orb.data.actor),
      subject: JSON.parse(orb.data.subject),
      payload: JSON.parse(orb.data.payload),
    }

    setTimelineEvents((prev) => [...prev, newEvent])

    // Simulate proof verification after delay
    setTimeout(() => {
      setTimelineEvents((prev) =>
        prev.map((event) =>
          event.event_id === orb.id
            ? {
                ...event,
                status: "verified" as const,
                proof: ["hash1_" + orb.id, "hash2_" + orb.id, "hash3_" + orb.id],
                root: "root_" + orb.id,
              }
            : event,
        ),
      )
    }, 3000)
  }

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <HeadBar3D />
      </div>

      {/* Main Content Grid */}
      <div className="pt-32 pb-8 px-6 space-y-8">
        {/* Top Row - Service Cards and Live Metrics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Service Cards */}
          <div className="xl:col-span-2">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ServiceCard3D
                  name="ms-gateway"
                  status="ok"
                  description="API Gateway Service"
                  kpi="99.9% uptime"
                  metrics={{ cpu: 45, memory: 62, requests: 1247, uptime: "99.9%", latency: 23, errors: 0 }}
                />
                <ServiceCard3D
                  name="ms-lie-detector"
                  status="warning"
                  description="Lie Detection Service"
                  kpi="AI accuracy: 94.2%"
                  metrics={{ cpu: 78, memory: 84, requests: 892, uptime: "98.7%", latency: 156, errors: 3 }}
                />
                <ServiceCard3D
                  name="ms-auditor"
                  status="ok"
                  description="Audit Logging Service"
                  kpi="Events logged: 15.2k"
                  metrics={{ cpu: 32, memory: 48, requests: 2156, uptime: "99.8%", latency: 12, errors: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="xl:col-span-1">
            <LiveMetrics3D
              services={["ms-gateway", "ms-lie-detector", "ms-auditor"]}
              maxDataPoints={30}
              pollInterval={2000}
            />
          </div>
        </div>

        {/* Middle Row - Event Console and Merkle Timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Event Console */}
          <div>
            <EventConsole3D onEventCreated={handleEventCreated} />
          </div>

          {/* Merkle Timeline */}
          <div>
            <MerkleTimeline3D
              events={timelineEvents}
              onEventSelect={(event) => console.log("Selected event:", event)}
            />
          </div>
        </div>

        {/* Bottom Row - 3D Scene */}
        <div className="h-96 rounded-lg overflow-hidden border border-border bg-card/20">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }} className="w-full h-full">
            <Suspense fallback={null}>
              <Environment preset="night" />
              <ambientLight intensity={0.2} />
              <pointLight position={[10, 10, 10]} intensity={0.5} color="#2d8fff" />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#34d399" />

              <Scene3D />

              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={15}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  )
}
