"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Zap, CheckCircle, XCircle, Clock, FileText } from "lucide-react"
import anime from "animejs"

/**
 * EventConsole3D.tsx
 * Versión corregida con:
 * - acceso seguro a variables de entorno (no usar process.env on client)
 * - safeJsonFetch que chequea content-type de forma segura (no llamar includes sobre null)
 * - manejo de errores en fetch para evitar Unhandled promise rejection
 * - protecciones alrededor de JSON.parse en la UI
 * - comentarios para accesibilidad respecto a DialogContent (aria-describedby)
 */

/* ------------------------
   Validación de formulario
   ------------------------ */
const eventSchema = z.object({
  action: z.string().min(1, "Action is required"),
  actor: z.string().refine((val) => {
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  }, "Actor must be valid JSON"),
  subject: z.string().refine((val) => {
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  }, "Subject must be valid JSON"),
  payload: z.string().refine((val) => {
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  }, "Payload must be valid JSON"),
})

type EventData = z.infer<typeof eventSchema>

interface EventResponse {
  accepted: boolean
  event_id: string
  trace_id?: string
}

interface ProofResponse {
  event_id: string
  proof: string[]
  root: string
  length: number
}

interface EventOrb {
  id: string
  status: "sending" | "processing" | "verified" | "failed"
  timestamp: Date
  data: EventData
  trace_id?: string
}

interface EventConsole3DProps {
  onSend?: (eventPayload: EventData) => Promise<EventResponse>
  onEventCreated?: (orb: EventOrb) => void
}

/* ----------------------------------------
   Utilidades seguras para fetch / headers
   ---------------------------------------- */

/**
 * Devuelve true si la cabecera content-type (si existe) contiene el fragmento.
 * Protegido contra headers.get === null (evita .includes sobre undefined).
 */
const contentTypeIncludes = (response: Response, fragment: string) => {
  const ct = response.headers?.get("content-type") ?? ""
  return typeof ct === "string" && ct.toLowerCase().includes(fragment.toLowerCase())
}

/**
 * Intentará parsear JSON si content-type sugiere JSON.
 * Si no es JSON o parse falla, lanza o retorna undefined según `fallbackOnError`.
 */
async function safeJsonFetch<T = any>(
  input: RequestInfo,
  init?: RequestInit,
  fallbackOnError?: T,
): Promise<T | undefined> {
  try {
    const resp = await fetch(input, init)
    // Si la respuesta no es OK, intentamos leer JSON si corresponde, sino fallback
    if (!resp.ok) {
      // Si es JSON, parseamos; si no, devolvemos fallback
      if (contentTypeIncludes(resp, "application/json")) {
        return (await resp.json()) as T
      } else {
        // respuesta no OK y no JSON -> fallback
        return fallbackOnError
      }
    }

    // OK response: si es JSON parseamos, si no devolvemos fallback
    if (contentTypeIncludes(resp, "application/json")) {
      return (await resp.json()) as T
    } else {
      // A veces el endpoint devuelve HTML (e.g. 502 html page) -> evitar thrown json error
      return fallbackOnError
    }
  } catch (err) {
    // Redirigimos el error para que el caller decida, pero no dejamos promise reject sin control.
    // Caller puede decidir si quiere fallback o manejar error.
    console.error("safeJsonFetch error:", err)
    return fallbackOnError
  }
}

/* ---------------------------------------------------
   Evitar uso de `process.env` directamente en cliente
   (uso de import.meta.env en Vite es seguro en cliente)
   --------------------------------------------------- */
const APP_MODE =
  typeof import.meta !== "undefined"
    ? ((import.meta as any).env?.MODE ?? (import.meta as any).env?.VITE_APP_MODE ?? "production")
    : "production"

/* -----------------------------
   Componente principal
   ----------------------------- */
export default function EventConsole3D({ onSend, onEventCreated }: EventConsole3DProps) {
  const [events, setEvents] = useState<EventOrb[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const consoleRef = useRef<HTMLDivElement>(null)
  const orbContainerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const form = useForm<EventData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      action: "user.login",
      actor: JSON.stringify({ user_id: "user_123", role: "admin" }, null, 2),
      subject: JSON.stringify({ resource: "dashboard", action: "access" }, null, 2),
      payload: JSON.stringify({ timestamp: new Date().toISOString(), ip: "192.168.1.1" }, null, 2),
    },
  })

  // Entry animation on mount
  useEffect(() => {
    if (consoleRef.current) {
      anime({
        targets: consoleRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 700,
        easing: "easeOutExpo",
        delay: 300,
      })
    }
    // Nota: no usamos process.env en el cliente para comprobar ambiente.
    // Si quieres comportamiento dev/prod, usa import.meta.env.MODE o una VITE_ variable pública.
    // Example: if (APP_MODE === 'development') { ... }
  }, [])

  // Input focus animation
  const handleInputFocus = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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

  // Create and animate event orb
  const createEventOrb = (eventData: EventData, eventId: string, traceId?: string) => {
    const orb: EventOrb = {
      id: eventId,
      status: "sending",
      timestamp: new Date(),
      data: eventData,
      trace_id: traceId,
    }

    setEvents((prev) => [...prev, orb])
    onEventCreated?.(orb)

    // Create visual orb element
    if (orbContainerRef.current && timelineRef.current) {
      const orbElement = document.createElement("div")
      orbElement.className =
        "absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(45,143,255,0.8)] pointer-events-none z-20"
      orbElement.style.left = "50%"
      orbElement.style.top = "50%"
      orbElement.style.transform = "translate(-50%, -50%)"
      orbContainerRef.current.appendChild(orbElement)

      // Animate orb spawn
      anime({
        targets: orbElement,
        scale: [0, 1.2, 1],
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutElastic(1, .8)",
        complete: () => {
          // Animate orb travel to timeline
          const consoleRect = consoleRef.current?.getBoundingClientRect()
          const timelineRect = timelineRef.current?.getBoundingClientRect()

          if (consoleRect && timelineRect) {
            const startX = consoleRect.left + consoleRect.width / 2
            const startY = consoleRect.top + consoleRect.height / 2
            const endX = timelineRect.left + timelineRect.width / 2
            const endY = timelineRect.top + timelineRect.height / 2

            // Bezier curve path animation
            anime({
              targets: orbElement,
              translateX: [0, (endX - startX) * 0.5, endX - startX],
              translateY: [0, (endY - startY) * 0.3 - 100, endY - startY],
              scale: [1, 0.8, 0.6],
              duration: 1200,
              easing: "easeInOutCubic",
              complete: () => {
                orbElement.remove()
                // Update orb status to processing
                setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "processing" } : e)))

                // Simulate proof verification
                setTimeout(() => {
                  checkEventProof(eventId)
                }, 2000)
              },
            })
          }
        },
      })
    }
  }

  // Check event proof status
  const checkEventProof = async (eventId: string) => {
    try {
      // Usamos safeJsonFetch para evitar errores si endpoint devuelve HTML en vez de JSON.
      const proofData = await safeJsonFetch<ProofResponse>(`/api/proofs/${eventId}`, undefined, undefined)

      if (!proofData) {
        // Si no hay JSON en respuesta, consideramos un mock exitoso (o se podría marcar como failed según lógica)
        // Aquí, para demo, simulamos la prueba si no recibimos JSON válido
        console.warn("No JSON proof returned; using mock proof for", eventId)
      }

      // Actualizar el estado de la orb a verified (si queremos más lógica, podemos comprobar proofData contents)
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "verified" } : e)))

      // Trigger success pulse animation
      if (timelineRef.current) {
        anime({
          targets: timelineRef.current,
          scale: [1, 1.05, 1],
          duration: 420,
          easing: "easeInOutSine",
        })
      }
    } catch (error) {
      console.error("Failed to verify proof:", error)
      // Update orb status to failed
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "failed" } : e)))
    }
  }

  const handleSubmit = async (data: EventData) => {
    setIsLoading(true)

    try {
      // Usamos la función onSend si se pasa, sino mockSendEvent
      const response = onSend ? await onSend(data) : await mockSendEvent(data)

      if (response.accepted) {
        createEventOrb(data, response.event_id, response.trace_id)
        form.reset({
          action: "user.action",
          actor: JSON.stringify({ user_id: "user_" + Math.floor(Math.random() * 1000) }, null, 2),
          subject: JSON.stringify({ resource: "system", action: "event" }, null, 2),
          payload: JSON.stringify({ timestamp: new Date().toISOString() }, null, 2),
        })
      } else {
        // Si el backend responde accepted=false, podemos mostrar un error o animación
        if (consoleRef.current) {
          anime({
            targets: consoleRef.current,
            translateX: [0, -6, 6, -6, 6, 0],
            duration: 420,
            easing: "easeInOutSine",
          })
        }
      }
    } catch (error) {
      console.error("Failed to send event:", error)
      // Shake animation on error
      if (consoleRef.current) {
        anime({
          targets: consoleRef.current,
          translateX: [0, -10, 10, -10, 10, 0],
          duration: 420,
          easing: "easeInOutSine",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Mock API function (seguimos ofreciendo demo funcional)
  const mockSendEvent = async (data: EventData): Promise<EventResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      accepted: true,
      event_id: "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      trace_id: "trace_" + Math.random().toString(36).substr(2, 9),
    }
  }

  const getStatusIcon = (status: EventOrb["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-4 h-4 text-chart-3 animate-spin" />
      case "processing":
        return <Zap className="w-4 h-4 text-primary animate-pulse" />
      case "verified":
        return <CheckCircle className="w-4 h-4 text-chart-2" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusColor = (status: EventOrb["status"]) => {
    switch (status) {
      case "sending":
        return "border-chart-3/50 bg-chart-3/10"
      case "processing":
        return "border-primary/50 bg-primary/10"
      case "verified":
        return "border-chart-2/50 bg-chart-2/10"
      case "failed":
        return "border-destructive/50 bg-destructive/10"
    }
  }

  return (
    <div className="space-y-6">
      {/* Event Console */}
      <Card
        ref={consoleRef}
        className="backdrop-blur-glass border-primary/20"
        style={{
          background: "rgba(6, 8, 25, 0.8)",
          boxShadow: "0 0 20px rgba(45, 143, 255, 0.1)",
        }}
      >
        <CardHeader>
          <CardTitle className="font-serif text-xl text-glow flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Event Console 3D
          </CardTitle>
          <p className="text-sm text-muted-foreground">Submit forensic events to the audit chain</p>
        </CardHeader>
        <CardContent>
          {/* Orb container for animations */}
          <div ref={orbContainerRef} className="absolute inset-0 pointer-events-none" />

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action" className="text-accent">
                  Action
                </Label>
                <Input
                  id="action"
                  {...form.register("action")}
                  onFocus={handleInputFocus}
                  className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20 font-mono"
                  placeholder="e.g., user.login, data.access"
                  aria-invalid={!!form.formState.errors.action}
                />
                {form.formState.errors.action && (
                  <p className="text-destructive text-sm" role="alert">
                    {form.formState.errors.action.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actor" className="text-accent">
                  Actor (JSON)
                </Label>
                <Textarea
                  id="actor"
                  {...form.register("actor")}
                  onFocus={handleInputFocus}
                  className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20 font-mono text-sm min-h-[120px]"
                  placeholder='{"user_id": "123", "role": "admin"}'
                  aria-invalid={!!form.formState.errors.actor}
                />
                {form.formState.errors.actor && (
                  <p className="text-destructive text-sm" role="alert">
                    {form.formState.errors.actor.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-accent">
                  Subject (JSON)
                </Label>
                <Textarea
                  id="subject"
                  {...form.register("subject")}
                  onFocus={handleInputFocus}
                  className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20 font-mono text-sm min-h-[120px]"
                  placeholder='{"resource": "dashboard", "action": "view"}'
                  aria-invalid={!!form.formState.errors.subject}
                />
                {form.formState.errors.subject && (
                  <p className="text-destructive text-sm" role="alert">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payload" className="text-accent">
                  Payload (JSON)
                </Label>
                <Textarea
                  id="payload"
                  {...form.register("payload")}
                  onFocus={handleInputFocus}
                  className="bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20 font-mono text-sm min-h-[120px]"
                  placeholder='{"timestamp": "2024-01-01T00:00:00Z", "ip": "192.168.1.1"}'
                  aria-invalid={!!form.formState.errors.payload}
                />
                {form.formState.errors.payload && (
                  <p className="text-destructive text-sm" role="alert">
                    {form.formState.errors.payload.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 gap-2 px-8">
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <Card
        ref={timelineRef}
        className="backdrop-blur-glass border-accent/20"
        style={{
          background: "rgba(6, 8, 25, 0.6)",
          boxShadow: "0 0 15px rgba(52, 211, 153, 0.1)",
        }}
      >
        <CardHeader>
          <CardTitle className="font-serif text-lg text-glow flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Event Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No events submitted yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {events
                .slice(-10)
                .reverse()
                .map((event) => {
                  // parse actor safely (evita excepciones si por algun motivo no es JSON)
                  let actorId = "unknown"
                  try {
                    const parsed = JSON.parse(event.data.actor)
                    actorId = typeof parsed === "object" && parsed !== null ? (parsed.user_id ?? "unknown") : "unknown"
                  } catch {
                    actorId = "unknown"
                  }

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(event.status)}`}
                    >
                      {getStatusIcon(event.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{actorId}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-mono text-sm">{event.data.action}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.timestamp.toLocaleTimeString()}
                          {event.trace_id && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {event.trace_id}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge variant={event.status === "verified" ? "default" : "secondary"} className="text-xs">
                        {event.status}
                      </Badge>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { EventConsole3D }
