"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Box, Html } from "@react-three/drei"
import type { Mesh, Group } from "three"

interface FloatingCard3DProps {
  position: [number, number, number]
  name: string
  status: "ok" | "warning" | "down" | "unknown"
  rotation?: [number, number, number]
}

const statusColors = {
  ok: "#10b981",
  warning: "#f59e0b",
  down: "#ef4444",
  unknown: "#6b7280",
}

const statusGlow = {
  ok: "#10b981",
  warning: "#f59e0b",
  down: "#ef4444",
  unknown: "#6b7280",
}

export default function FloatingCard3D({ position, name, status, rotation = [0, 0, 0] }: FloatingCard3DProps) {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }

    if (groupRef.current && hovered) {
      groupRef.current.scale.setScalar(1.1)
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1)
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main Card */}
      <Box
        ref={meshRef}
        args={[2, 1.2, 0.1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#1e293b"
          emissive={statusColors[status]}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </Box>

      {/* Status Indicator */}
      <Box args={[0.3, 0.3, 0.05]} position={[0.7, 0.4, 0.06]}>
        <meshBasicMaterial color={statusColors[status]} />
      </Box>

      {/* Glow Effect */}
      <Box args={[2.2, 1.4, 0.05]} position={[0, 0, -0.05]}>
        <meshBasicMaterial color={statusGlow[status]} opacity={hovered ? 0.2 : 0.1} transparent />
      </Box>

      {/* Text Labels */}
      <Text
        position={[0, 0.2, 0.06]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {name}
      </Text>

      <Text
        position={[0, -0.1, 0.06]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {status.toUpperCase()}
      </Text>

      {/* HTML Overlay for detailed info on hover */}
      {hovered && (
        <Html
          position={[0, -0.8, 0]}
          center
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs text-foreground min-w-[120px]">
            <div className="font-semibold mb-1">{name}</div>
            <div className="text-muted-foreground">
              Status: <span className="text-foreground">{status}</span>
            </div>
            <div className="text-muted-foreground">
              Uptime: <span className="text-foreground">99.9%</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
