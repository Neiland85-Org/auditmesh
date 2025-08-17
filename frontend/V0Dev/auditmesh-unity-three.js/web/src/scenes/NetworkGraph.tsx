"use client"

import type React from "react"
import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import type * as THREE from "three"

interface Node {
  id: string
  position: [number, number, number]
  color: string
}

interface NetworkGraphProps {
  nodes?: Node[]
}

const AnimatedNode: React.FC<{ node: Node }> = ({ node }) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + node.position[0]) * 0.01
    }
  })

  return (
    <Sphere ref={meshRef} position={node.position} args={[0.2, 16, 16]}>
      <meshStandardMaterial color={node.color} />
    </Sphere>
  )
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes = [] }) => {
  const defaultNodes: Node[] = useMemo(
    () => [
      { id: "1", position: [0, 0, 0], color: "#ff6b6b" },
      { id: "2", position: [2, 1, -1], color: "#4ecdc4" },
      { id: "3", position: [-2, -1, 1], color: "#45b7d1" },
      { id: "4", position: [1, -2, 0], color: "#96ceb4" },
    ],
    [],
  )

  const nodeList = nodes.length > 0 ? nodes : defaultNodes

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        {nodeList.map((node) => (
          <AnimatedNode key={node.id} node={node} />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default NetworkGraph
