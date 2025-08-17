"use client"

import type React from "react"
import CRMIntegrationDashboard from "./crm-integration-dashboard"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Zap, CreditCard, X, AlertTriangle, ArrowRight } from "lucide-react"

interface LieDetectorButtonProps {
  onPurchase?: () => void
  onInteraction?: () => void
}

export { LieDetectorButton }
export default function LieDetectorButton({ onPurchase, onInteraction }: LieDetectorButtonProps) {
  const [lieCount, setLieCount] = useState(47)
  const [isActive, setIsActive] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [credits, setCredits] = useState(150) // Starting credits
  const [isInteracting, setIsInteracting] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [geometricLines, setGeometricLines] = useState<
    Array<{ x1: number; y1: number; x2: number; y2: number; id: number }>
  >([])
  const [clickCount, setClickCount] = useState(0)
  const [showEnterMessage, setShowEnterMessage] = useState(false)
  const [systemActivated, setSystemActivated] = useState(false)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)
  const [showCRMDashboard, setShowCRMDashboard] = useState(false)

  useEffect(() => {
    if (!isActive || credits <= 0) return

    const interval = setInterval(() => {
      // Randomly decrease lie count and credits
      if (Math.random() > 0.7) {
        setLieCount((prev) => Math.max(0, prev - Math.floor(Math.random() * 3) - 1))
        setCredits((prev) => Math.max(0, prev - 1))
      }

      // When credits run out, show purchase modal
      if (credits <= 10 && !showPurchaseModal) {
        setShowPurchaseModal(true)
        setIsActive(false)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive, credits, showPurchaseModal])

  const handlePurchase = (amount: number) => {
    setCredits((prev) => prev + amount * 10) // 10 credits per euro
    setShowPurchaseModal(false)
    setIsActive(true)
    onPurchase?.()
  }

  const handleGlobeClick = () => {
    onInteraction?.()

    if (!systemActivated) {
      setClickCount((prev) => prev + 1)
      if (clickCount === 1) {
        setShowEnterMessage(true)
        setSystemActivated(true)
        setTimeout(() => {
          setShowEnterMessage(false)
          setShowPaymentPrompt(true)
        }, 4000)
      }
      setTimeout(() => setClickCount(0), 500)
    } else if (showPaymentPrompt) {
      setShowPaymentPrompt(false)
      setShowCRMDashboard(true)
    } else {
      setShowCRMDashboard(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsInteracting(true)
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    setMousePos({ x: centerX, y: centerY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteracting) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    // Create geometric lines on drag
    const newLine = {
      x1: mousePos.x,
      y1: mousePos.y,
      x2: x,
      y2: y,
      id: Date.now() + Math.random(),
    }
    setGeometricLines((prev) => [...prev.slice(-5), newLine]) // Keep last 6 lines
  }

  const handleMouseUp = () => {
    setIsInteracting(false)
  }

  const handleCRMConnect = (crmName: string) => {
    console.log(`[v0] Connected to CRM: ${crmName}`)
    // In real app, this would trigger the purchase flow for premium CRMs
    if (["salesforce", "freshworks"].includes(crmName)) {
      setShowCRMDashboard(false)
      setShowPurchaseModal(true)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showEnterMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-32 right-6 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-4 rounded-xl shadow-2xl border-2 border-white/30">
              <motion.h3
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,1)",
                    "0 0 10px rgba(255,255,255,0.8)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="text-white font-bold text-lg mb-2"
              >
                🚨 SYSTEM ACTIVATED
              </motion.h3>
              <p className="text-white font-semibold text-sm leading-tight">
                UNCOVER LIES, PLOTS, TOXIC BEHAVIORS & WORKPLACE ESPIONAGE BEFORE THEY STRIKE!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            className="fixed bottom-32 right-6 z-50 max-w-sm cursor-pointer"
            onClick={() => {
              setShowPaymentPrompt(false)
              setShowCRMDashboard(true)
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.4)",
                  "0 0 30px rgba(34, 197, 94, 0.8)",
                  "0 0 20px rgba(34, 197, 94, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 p-4 rounded-xl shadow-2xl border-2 border-white/30 hover:from-green-500 hover:via-emerald-400 hover:to-green-500 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.h3
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(255,255,255,0.8)",
                        "0 0 20px rgba(255,255,255,1)",
                        "0 0 10px rgba(255,255,255,0.8)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="text-white font-bold text-lg mb-1"
                  >
                    💳 CLICK TO RECHARGE
                  </motion.h3>
                  <p className="text-white font-semibold text-sm leading-tight">Unlock premium lie detection powers!</p>
                </div>
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="text-white" size={24} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.div
          animate={{
            rotateY: isActive ? 360 : 0,
            scale: isActive ? [1, 1.05, 1] : 1,
            boxShadow: showPaymentPrompt
              ? ["0 0 40px rgba(34, 197, 94, 0.6)", "0 0 60px rgba(34, 197, 94, 1)", "0 0 40px rgba(34, 197, 94, 0.6)"]
              : undefined,
          }}
          transition={{
            rotateY: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            boxShadow: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
          }}
          className="relative"
        >
          <div
            className="relative h-24 w-24 cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleGlobeClick}
          >
            <motion.div
              animate={{
                scale: isInteracting ? 1.1 : 1,
                rotateX: isInteracting ? (mousePos.y - 48) / 10 : 0,
                rotateY: isInteracting ? (mousePos.x - 48) / 10 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`
                relative h-24 w-24 rounded-full p-0 overflow-hidden
                ${
                  showPaymentPrompt
                    ? "bg-gradient-to-br from-green-600 via-emerald-500 to-green-800 hover:from-green-500 hover:via-emerald-400 hover:to-green-700"
                    : "bg-gradient-to-br from-blue-600 via-green-500 to-blue-800 hover:from-blue-500 hover:via-green-400 hover:to-blue-700"
                }
                shadow-[0_0_40px_rgba(59,130,246,0.6)]
                hover:shadow-[0_0_50px_rgba(59,130,246,0.8)]
                border-4 border-white/30
                ${!isActive ? "opacity-50 cursor-not-allowed" : ""}
                ${isInteracting ? "shadow-[0_0_60px_rgba(59,130,246,1)]" : ""}
                ${showPaymentPrompt ? "shadow-[0_0_50px_rgba(34,197,94,0.8)]" : ""}
              `}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {geometricLines.map((line) => (
                  <motion.line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2 }}
                  />
                ))}
              </svg>

              <motion.div
                className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-blue-600 overflow-hidden"
                animate={{
                  scale: isInteracting ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-2 left-2 w-3 h-2 bg-green-600 rounded-sm opacity-80"></div>
                <div className="absolute top-4 right-3 w-2 h-3 bg-green-600 rounded-sm opacity-80"></div>
                <div className="absolute bottom-3 left-3 w-4 h-2 bg-green-600 rounded-sm opacity-80"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-600 rounded-full opacity-80"></div>

                <div className="absolute inset-0 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
              </motion.div>

              <div className="relative z-10 flex flex-col items-center justify-center text-white mt-1">
                <Eye size={12} className="mb-0.5" />
                <span className="text-[7px] font-bold leading-none">LIE</span>
                <span className="text-[7px] font-bold leading-none">DETECTOR</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -top-3 -right-3 bg-red-600 text-white text-2xl font-bold rounded-full h-24 w-24 flex items-center justify-center border-4 border-white shadow-lg"
            >
              {lieCount}
            </motion.div>

            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge
                variant={credits > 50 ? "default" : credits > 10 ? "secondary" : "destructive"}
                className="text-xs px-2 py-1 font-bold"
              >
                {credits}
              </Badge>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", duration: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-glass rounded-2xl p-6 max-w-lg w-full border border-glass-border shadow-glow"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-400" size={24} />
                  <h3 className="text-xl font-bold text-foreground">Recharge Credits</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPurchaseModal(false)} className="h-8 w-8 p-0">
                  <X size={16} />
                </Button>
              </div>

              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 0 20px rgba(239, 68, 68, 0.3)",
                    "0 0 30px rgba(239, 68, 68, 0.6)",
                    "0 0 20px rgba(239, 68, 68, 0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="mb-6 p-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-red-400/50 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-red-400 text-lg mb-2">🔍 DETECTOR ACTIVE</h4>
                    <p className="text-foreground font-semibold text-base leading-relaxed">
                      UNCOVER LIES, PLOTS, TOXIC BEHAVIORS & WORKPLACE ESPIONAGE BEFORE THEY STRIKE!
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="mb-6">
                <p className="text-muted-foreground mb-2 text-lg">
                  You have <span className="font-bold text-red-400 text-2xl">{credits} credits</span> remaining
                </p>
                <p className="text-sm text-muted-foreground">
                  You need more credits to continue detecting lies in your CRM and workspace.
                </p>
              </div>

              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handlePurchase(15)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CreditCard size={20} className="mr-3" />
                    15€ - 150 Credits
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="ml-2"
                    >
                      ⚡
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handlePurchase(25)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: [-100, 400] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    <CreditCard size={20} className="mr-3" />
                    25€ - 300 Credits (Popular)
                    <Badge className="ml-2 bg-yellow-500 text-black">🔥</Badge>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handlePurchase(50)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CreditCard size={20} className="mr-3" />
                    50€ - 700 Credits (Best Value)
                    <Badge className="ml-2 bg-gold text-black">👑</Badge>
                  </Button>
                </motion.div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Credits are consumed automatically while we detect lies in real time.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CRMIntegrationDashboard
        isOpen={showCRMDashboard}
        onClose={() => setShowCRMDashboard(false)}
        onConnect={handleCRMConnect}
      />
    </>
  )
}
