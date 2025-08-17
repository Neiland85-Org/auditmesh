"use client"

import type React from "react"
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Box } from "@react-three/drei"
import type * as THREE from "three"

interface RotatingBoxProps {
  position: [number, number, number]
  color: string
}

const RotatingBox: React.FC<RotatingBoxProps> = ({ position, color }) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  )
}

const AuditVisualization: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingBox position={[-2, 0, 0]} color="hotpink" />
        <RotatingBox position={[2, 0, 0]} color="orange" />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default AuditVisualization
