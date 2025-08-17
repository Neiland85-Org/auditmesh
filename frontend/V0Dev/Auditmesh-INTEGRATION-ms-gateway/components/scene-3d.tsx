"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import type { Group } from "three"
import FloatingCard3D from "./floating-card-3d"

export default function Scene3D() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Background particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02]}
          position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20]}
        >
          <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
        </Sphere>
      ))}

      {/* Microservice Cards */}
      <FloatingCard3D position={[-3, 1, 0]} name="Gateway" status="ok" rotation={[0, 0.2, 0]} />
      <FloatingCard3D position={[0, 0, 0]} name="Lie Detector" status="warning" rotation={[0, 0, 0]} />
      <FloatingCard3D position={[3, -1, 0]} name="Auditor" status="ok" rotation={[0, -0.2, 0]} />

      {/* Central connecting lines */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[6, 0.02, 0.02]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
      </mesh>
      <mesh position={[-1.5, 0.5, -1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[3, 0.02, 0.02]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
      </mesh>
      <mesh position={[1.5, -0.5, -1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[3, 0.02, 0.02]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}
