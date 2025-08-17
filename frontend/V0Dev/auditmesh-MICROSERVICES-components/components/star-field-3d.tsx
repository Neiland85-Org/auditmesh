"use client"

import type React from "react"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

interface StarFieldProps {
  count?: number
  children?: React.ReactNode
}

function Stars({ count = 5000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const { mouse, viewport } = useThree()

  // Generar posiciones aleatorias para las estrellas
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Distribución esférica alrededor del usuario
      const radius = Math.random() * 50 + 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Colores variados para las estrellas
      const intensity = Math.random() * 0.5 + 0.5
      colors[i * 3] = intensity // R
      colors[i * 3 + 1] = intensity * 0.8 + 0.2 // G
      colors[i * 3 + 2] = intensity // B
    }

    return [positions, colors]
  }, [count])

  // Animación de rotación suave y respuesta al mouse
  useFrame((state) => {
    if (ref.current) {
      // Rotación lenta del campo de estrellas
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      ref.current.rotation.y += 0.001

      // Efecto de paralaje con el mouse
      const x = (mouse.x * viewport.width) / 50
      const y = (mouse.y * viewport.height) / 50
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x, 0.02)
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y, 0.02)
    }
  })

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      onPointerMove={(e) => {
        e.stopPropagation()
        setHovered(e.index || null)
      }}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation()
        // Efecto de "explosión" al hacer click
        if (ref.current && e.index !== undefined) {
          const geometry = ref.current.geometry
          const position = geometry.attributes.position
          const originalPos = [position.getX(e.index), position.getY(e.index), position.getZ(e.index)]

          // Animación de expansión temporal
          const animate = () => {
            const scale = 1 + Math.sin(Date.now() * 0.01) * 0.1
            position.setXYZ(e.index!, originalPos[0] * scale, originalPos[1] * scale, originalPos[2] * scale)
            position.needsUpdate = true
          }

          const interval = setInterval(animate, 16)
          setTimeout(() => clearInterval(interval), 1000)
        }
      }}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={hovered !== null ? 0.008 : 0.004}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </Points>
  )
}

function Background() {
  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#000000" side={THREE.BackSide} />
    </mesh>
  )
}

export function StarField3D({ count = 5000, children }: StarFieldProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo 3D */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true, alpha: true }}>
          <Background />
          <Stars count={count} />
          <ambientLight intensity={0.1} />
        </Canvas>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 w-full h-full overflow-auto">
        <div className="bg-black/20 backdrop-blur-sm min-h-full">{children}</div>
      </div>
    </div>
  )
}
