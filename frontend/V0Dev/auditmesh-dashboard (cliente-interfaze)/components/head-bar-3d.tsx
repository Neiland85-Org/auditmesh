"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, LogIn, UserPlus, Sparkles } from "lucide-react"
import anime from "animejs"

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accept_tos: z.boolean().refine((val) => val === true, "You must accept the terms of service"),
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    roles: string[]
  }
  expires_at: string
}

interface HeadBar3DProps {
  onLogin?: (credentials: LoginData) => Promise<AuthResponse>
  onRegister?: (payload: RegisterData) => Promise<AuthResponse>
}

export default function HeadBar3D({ onLogin, onRegister }: HeadBar3DProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AuthResponse["user"] | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  // Entry animation on mount
  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 700,
        easing: "easeOutExpo",
      })
    }
  }, [])

  // Input focus animation
  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    anime({
      targets: event.target,
      scale: [1, 0.98],
      duration: 180,
      easing: "easeOutQuad",
      complete: () => {
        anime({
          targets: event.target,
          scale: [0.98, 1],
          duration: 180,
          easing: "easeOutQuad",
        })
      },
    })
  }

  // Success animation with particles
  const triggerSuccessAnimation = () => {
    if (cardRef.current && particlesRef.current) {
      // Card expansion animation
      anime
        .timeline()
        .add({
          targets: cardRef.current,
          scale: [1, 1.05],
          duration: 200,
          easing: "easeOutQuad",
        })
        .add({
          targets: cardRef.current,
          scale: [1.05, 1],
          duration: 300,
          easing: "easeOutElastic(1, .8)",
        })

      // Particle burst effect
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("div")
        particle.className = "absolute w-1 h-1 bg-accent rounded-full pointer-events-none"
        particle.style.left = "50%"
        particle.style.top = "50%"
        particlesRef.current.appendChild(particle)

        anime({
          targets: particle,
          translateX: anime.random(-100, 100),
          translateY: anime.random(-100, 100),
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          duration: 1000,
          easing: "easeOutExpo",
          complete: () => particle.remove(),
        })
      }
    }
  }

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true)
    try {
      const response = onLogin ? await onLogin(data) : await mockLogin(data)
      setUser(response.user)
      setIsLoggedIn(true)
      setIsLoginOpen(false)
      triggerSuccessAnimation()
      loginForm.reset()
    } catch (error) {
      // Shake animation on error
      if (cardRef.current) {
        anime({
          targets: cardRef.current,
          translateX: [0, -10, 10, -10, 10, 0],
          duration: 420,
          easing: "easeInOutSine",
        })
      }
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = onRegister ? await onRegister(data) : await mockRegister(data)
      setUser(response.user)
      setIsLoggedIn(true)
      setIsRegisterOpen(false)
      triggerSuccessAnimation()
      registerForm.reset()
    } catch (error) {
      // Shake animation on error
      if (cardRef.current) {
        anime({
          targets: cardRef.current,
          translateX: [0, -10, 10, -10, 10, 0],
          duration: 420,
          easing: "easeInOutSine",
        })
      }
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    // Fade out animation
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [1, 0.8, 1],
        duration: 300,
        easing: "easeInOutSine",
      })
    }
  }

  // Mock API functions
  const mockLogin = async (data: LoginData): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      token: "mock-jwt-token",
      user: {
        id: "1",
        name: data.username,
        roles: ["user"],
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      token: "mock-jwt-token",
      user: {
        id: "1",
        name: data.username,
        roles: ["user"],
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  return (
    <div className="relative">
      {/* Particle container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-20" />

      {/* Main header card */}
      <div
        ref={cardRef}
        className="backdrop-blur-glass border border-primary/20 rounded-xl p-4 hover-tilt"
        style={{
          background: "rgba(6, 8, 25, 0.8)",
          boxShadow: "0 0 20px rgba(45, 143, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground mb-1 text-glow">AuditMesh</h1>
            <p className="text-sm text-muted-foreground font-sans">Forensic Microservices Console</p>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">{user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-primary/30 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* System Status */}
                <div className="flex items-center gap-2 px-3 py-2 bg-chart-2/10 rounded-lg border border-chart-2/20">
                  <div className="w-2 h-2 bg-chart-2 rounded-full animate-neon-pulse"></div>
                  <span className="text-xs text-chart-2 font-medium">SYSTEM ONLINE</span>
                </div>

                {/* Login Dialog */}
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 hover:border-primary/50 hover:bg-primary/10 gap-2 bg-transparent"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-glass border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl text-glow">Access Terminal</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username" className="text-accent">
                          Username
                        </Label>
                        <Input
                          id="login-username"
                          {...loginForm.register("username")}
                          onFocus={handleInputFocus}
                          className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                          placeholder="Enter username"
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-destructive text-sm" role="alert">
                            {loginForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-accent">
                          Password
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          {...loginForm.register("password")}
                          onFocus={handleInputFocus}
                          className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                          placeholder="Enter password"
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-destructive text-sm" role="alert">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            Access Granted
                          </>
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Register Dialog */}
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                      <UserPlus className="w-4 h-4" />
                      Register
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-glass border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl text-glow">Create Access Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username" className="text-accent">
                          Username
                        </Label>
                        <Input
                          id="register-username"
                          {...registerForm.register("username")}
                          onFocus={handleInputFocus}
                          className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                          placeholder="Choose username"
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-destructive text-sm" role="alert">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-accent">
                          Email
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          {...registerForm.register("email")}
                          onFocus={handleInputFocus}
                          className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                          placeholder="Enter email address"
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-destructive text-sm" role="alert">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-accent">
                          Password
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          {...registerForm.register("password")}
                          onFocus={handleInputFocus}
                          className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                          placeholder="Create password"
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-destructive text-sm" role="alert">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accept-tos"
                          {...registerForm.register("accept_tos")}
                          className="border-primary/30 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="accept-tos" className="text-sm text-muted-foreground">
                          I accept the terms of service and privacy policy
                        </Label>
                      </div>
                      {registerForm.formState.errors.accept_tos && (
                        <p className="text-destructive text-sm" role="alert">
                          {registerForm.formState.errors.accept_tos.message}
                        </p>
                      )}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin" />
                            Creating Profile...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Initialize Access
                          </>
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
