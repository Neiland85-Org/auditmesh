"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Text } from "@react-three/drei"
import type { Group } from "three"
import type { MicroserviceData } from "@/types/auditmesh"

interface Scene3DBackgroundProps {
  services?: MicroserviceData[]
  selectedService?: string | null
  viewMode?: string
}

export default function Scene3DBackground({
  services = [],
  selectedService,
  viewMode = "overview",
}: Scene3DBackgroundProps) {
  const groupRef = useRef<Group>(null)
  const particlesRef = useRef<Group>(null)
  const servicesRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }

    if (servicesRef.current && services.length > 0) {
      servicesRef.current.children.forEach((child, index) => {
        const service = services[index]
        if (service) {
          const isSelected = selectedService === service.id
          const scale = isSelected ? 1.2 : 1.0
          const targetScale = service.status === "error" ? 1.1 : scale

          child.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1)

          // Pulse effect for errors
          if (service.status === "error") {
            const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1
            child.scale.multiplyScalar(pulse)
          }
        }
      })
    }
  })

  useEffect(() => {
    const handleFocusService = (event: CustomEvent) => {
      const { serviceId } = event.detail
      console.log(`[v0] Focusing on service: ${serviceId}`)
      // Additional 3D scene animations could be triggered here
    }

    window.addEventListener("focusService", handleFocusService as EventListener)
    return () => window.removeEventListener("focusService", handleFocusService as EventListener)
  }, [])

  return (
    <group ref={groupRef}>
      {/* Enhanced Animated Background Particles */}
      <group ref={particlesRef}>
        {Array.from({ length: viewMode === "detailed" ? 150 : 100 }).map((_, i) => {
          const radius = 15 + Math.random() * 10
          const theta = (i / 100) * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)

          return (
            <Sphere
              key={i}
              args={[0.01 + Math.random() * 0.02]}
              position={[
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi),
              ]}
            >
              <meshBasicMaterial
                color={Math.random() > 0.5 ? "#06b6d4" : "#ec4899"}
                opacity={0.1 + Math.random() * 0.3}
                transparent
              />
            </Sphere>
          )
        })}
      </group>

      {/* Enhanced Grid Lines with Dynamic Opacity */}
      <group>
        {/* Horizontal grid */}
        {Array.from({ length: 21 }).map((_, i) => (
          <mesh key={`h-${i}`} position={[0, 0, (i - 10) * 0.5]}>
            <boxGeometry args={[10, 0.005, 0.005]} />
            <meshBasicMaterial color="#06b6d4" opacity={viewMode === "topology" ? 0.2 : 0.1} transparent />
          </mesh>
        ))}
        {/* Vertical grid */}
        {Array.from({ length: 21 }).map((_, i) => (
          <mesh key={`v-${i}`} position={[(i - 10) * 0.5, 0, 0]}>
            <boxGeometry args={[0.005, 0.005, 10]} />
            <meshBasicMaterial color="#06b6d4" opacity={viewMode === "topology" ? 0.2 : 0.1} transparent />
          </mesh>
        ))}
      </group>

      {/* Enhanced Central Orbital Rings */}
      <group>
        {[2, 4, 6].map((radius, i) => (
          <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.01, 8, 64]} />
            <meshBasicMaterial
              color={i === 0 ? "#06b6d4" : i === 1 ? "#ec4899" : "#10b981"}
              opacity={selectedService ? 0.3 : 0.2}
              transparent
            />
          </mesh>
        ))}
      </group>

      <group ref={servicesRef}>
        {services.map((service, index) => {
          const position = service.position || [
            Math.cos((index / services.length) * Math.PI * 2) * 3,
            Math.sin((index / services.length) * Math.PI * 2) * 0.5,
            Math.sin((index / services.length) * Math.PI * 2) * 3,
          ]

          const getServiceColor = () => {
            switch (service.status) {
              case "ok":
                return "#10b981"
              case "warning":
                return "#f59e0b"
              case "error":
                return "#ef4444"
              default:
                return "#6b7280"
            }
          }

          return (
            <group key={service.id} position={position}>
              <Sphere args={[0.1]}>
                <meshBasicMaterial
                  color={getServiceColor()}
                  opacity={selectedService === service.id ? 0.8 : 0.6}
                  transparent
                />
              </Sphere>

              {viewMode === "detailed" && (
                <Text position={[0, 0.3, 0]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
                  {service.name}
                </Text>
              )}
            </group>
          )
        })}
      </group>
    </group>
  )
}
