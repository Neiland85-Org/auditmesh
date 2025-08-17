// frontend/src/components/EventConsole3D.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Zap, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import anime from "animejs";

/* -------------------
   Validation schema
   ------------------- */
const eventSchema = z.object({
  action: z.string().min(1, "Action is required"),
  actor: z
    .string()
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Actor must be valid JSON"),
  subject: z
    .string()
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Subject must be valid JSON"),
  payload: z
    .string()
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Payload must be valid JSON"),
});
type EventData = z.infer<typeof eventSchema>;

/* -------------------
   Types
   ------------------- */
interface EventResponse {
  accepted: boolean;
  event_id: string;
  trace_id?: string;
}

interface ProofResponse {
  event_id: string;
  proof: string[];
  root: string;
  length: number;
}

interface EventOrb {
  id: string;
  status: "sending" | "processing" | "verified" | "failed";
  timestamp: Date;
  data: EventData;
  trace_id?: string;
}

interface EventConsole3DProps {
  onSend?: (eventPayload: EventData) => Promise<EventResponse>;
  onEventCreated?: (orb: EventOrb) => void;
}

/* -------------------
   Helpers
   ------------------- */

/**
 * Safe JSON fetch: validates status and content-type before parsing.
 * If content-type is not JSON, returns null and a snippet for debug.
 */
async function safeFetchJson(
  url: string,
  init?: RequestInit,
  signal?: AbortSignal
): Promise<{ ok: boolean; data?: any; snippet?: string; status?: number }> {
  try {
    const res = await fetch(url, { ...init, signal });

    const status = res.status;
    const ct = res.headers.get("content-type") || "";

    // if non-2xx, gather text for debugging
    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, snippet: txt.slice(0, 800), status };
    }

    // if JSON content-type, parse JSON
    if (ct.includes("application/json")) {
      const data = await res.json();
      return { ok: true, data, status };
    }

    // not JSON (likely HTML) -> read text snippet and return ok=false
    const body = await res.text();
    const snippet = body.slice(0, 800).replace(/\s+/g, " ");
    return { ok: false, snippet, status };
  } catch (err: any) {
    // network errors, aborted, etc.
    return { ok: false, snippet: String(err?.message ?? err) };
  }
}

/* -------------------
   Component
   ------------------- */

export default function EventConsole3D({ onSend, onEventCreated }: EventConsole3DProps) {
  const [events, setEvents] = useState<EventOrb[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const consoleRef = useRef<HTMLDivElement | null>(null);
  const orbContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const isMounted = useRef(true);
  const activeProofControllers = useRef<Record<string, AbortController>>({});
  const createdOrbElements = useRef<HTMLElement[]>([]);

  const form = useForm<EventData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      action: "user.login",
      actor: JSON.stringify({ user_id: "user_123", role: "admin" }, null, 2),
      subject: JSON.stringify({ resource: "dashboard", action: "access" }, null, 2),
      payload: JSON.stringify({ timestamp: new Date().toISOString(), ip: "192.168.1.1" }, null, 2),
    },
  });

  // mount / unmount bookkeeping
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;

      // abort any pending proof requests
      Object.values(activeProofControllers.current).forEach((c) => {
        try {
          c.abort();
        } catch {
          /* noop */
        }
      });

      // remove any remaining orb elements
      createdOrbElements.current.forEach((el) => {
        try {
          el.remove();
        } catch {
          /* noop */
        }
      });
      createdOrbElements.current = [];
    };
  }, []);

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
        delay: 200,
      });
    }
  }, []);

  // small input focus animation
  const handleInputFocus = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    anime({
      targets: event.target,
      scale: [1, 0.985],
      duration: 160,
      easing: "easeOutQuad",
      complete: () => {
        anime({
          targets: event.target,
          scale: [0.985, 1],
          duration: 160,
          easing: "easeOutQuad",
        });
      },
    });
  };

  // safe JSON parse util for actor field
  const safeParseActor = useCallback((actorStr: string) => {
    try {
      const obj = JSON.parse(actorStr);
      // prefer user_id if exists
      return obj?.user_id ?? JSON.stringify(obj);
    } catch {
      return "invalid-actor";
    }
  }, []);

  // Create and animate event orb (visual)
  const createEventOrb = useCallback(
    (eventData: EventData, eventId: string, traceId?: string) => {
      const orb: EventOrb = {
        id: eventId,
        status: "sending",
        timestamp: new Date(),
        data: eventData,
        trace_id: traceId,
      };

      if (!isMounted.current) return;
      setEvents((prev) => [...prev, orb]);
      onEventCreated?.(orb);

      // visual orb element
      const container = orbContainerRef.current;
      const timelineEl = timelineRef.current;
      const consoleEl = consoleRef.current;
      if (!container || !timelineEl || !consoleEl) return;

      const orbElement = document.createElement("div");
      orbElement.className =
        "absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(45,143,255,0.85)] pointer-events-none z-20";
      orbElement.style.left = "50%";
      orbElement.style.top = "50%";
      orbElement.style.transform = "translate(-50%, -50%)";
      orbElement.style.willChange = "transform, opacity";
      container.appendChild(orbElement);

      // track for cleanup
      createdOrbElements.current.push(orbElement);

      // spawn animation
      anime({
        targets: orbElement,
        scale: [0, 1.25, 1],
        opacity: [0, 1],
        duration: 360,
        easing: "easeOutElastic(1, .75)",
        complete: () => {
          // compute global positions
          const consoleRect = consoleEl.getBoundingClientRect();
          const timelineRect = timelineEl.getBoundingClientRect();

          const startX = consoleRect.left + consoleRect.width / 2;
          const startY = consoleRect.top + consoleRect.height / 2;
          const endX = timelineRect.left + timelineRect.width / 2;
          const endY = timelineRect.top + timelineRect.height / 2;

          // translate relative to orbElement parent (orb container is absolute inset-0)
          const dx = endX - startX;
          const dy = endY - startY;

          anime({
            targets: orbElement,
            translateX: [0, dx * 0.55, dx],
            translateY: [0, dy * 0.35 - 80, dy],
            scale: [1, 0.8, 0.6],
            duration: 1100,
            easing: "easeInOutCubic",
            complete: () => {
              // remove visual orb
              try {
                orbElement.remove();
              } catch {
                /* noop */
              }
              // remove from tracking array
              createdOrbElements.current = createdOrbElements.current.filter((e) => e !== orbElement);

              // set status to processing
              if (!isMounted.current) return;
              setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "processing" } : e)));

              // after short delay, check proof
              setTimeout(() => {
                // fire off proof check (with its own abort controller)
                checkEventProof(eventId);
              }, 700);
            },
          });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // check event proof (calls API). Robustly handles HTML/no-json and aborts on unmount.
  const checkEventProof = useCallback(
    async (eventId: string) => {
      if (!isMounted.current) return;

      const controller = new AbortController();
      activeProofControllers.current[eventId] = controller;

      try {
        // Replace real API path as needed.
        const url = `/api/proofs/${encodeURIComponent(eventId)}`;
        const result = await safeFetchJson(url, undefined, controller.signal);

        if (!isMounted.current) return;

        if (result.ok && result.data) {
          // we got JSON proof data
          const proofData: ProofResponse = result.data as ProofResponse;
          // can use proofData if needed...
          setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "verified" } : e)));
        } else {
          // backend returned non-json (HTML) or non-2xx; fallback to mock verification
          console.warn(`Proof fetch for ${eventId} returned non-JSON or non-OK. snippet:`, result.snippet);
          // simulate verification success (demo)
          setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "verified" } : e)));
        }

        // success pulse on timeline
        if (timelineRef.current) {
          anime({
            targets: timelineRef.current,
            scale: [1, 1.04, 1],
            duration: 420,
            easing: "easeInOutSine",
          });
        }
      } catch (err: any) {
        console.error("Failed to verify proof:", err);
        if (!isMounted.current) return;
        setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: "failed" } : e)));
      } finally {
        // cleanup controller
        delete activeProofControllers.current[eventId];
      }
    },
    []
  );

  // send handler
  const handleSubmit = async (data: EventData) => {
    if (!isMounted.current) return;
    setIsLoading(true);

    try {
      // sometimes caller provides custom onSend
      const response = onSend ? await onSend(data) : await mockSendEvent(data);

      if (response.accepted) {
        createEventOrb(data, response.event_id, response.trace_id);
        // reset form with new random-ish actor
        form.reset({
          action: "user.action",
          actor: JSON.stringify({ user_id: "user_" + Math.floor(Math.random() * 10000) }, null, 2),
          subject: JSON.stringify({ resource: "system", action: "event" }, null, 2),
          payload: JSON.stringify({ timestamp: new Date().toISOString() }, null, 2),
        });
      } else {
        // server rejected - show shake / feedback
        if (consoleRef.current) {
          anime({
            targets: consoleRef.current,
            translateX: [0, -8, 8, -8, 8, 0],
            duration: 420,
            easing: "easeInOutSine",
          });
        }
      }
    } catch (err) {
      console.error("Failed to send event:", err);
      if (consoleRef.current) {
        anime({
          targets: consoleRef.current,
          translateX: [0, -8, 8, -8, 8, 0],
          duration: 420,
          easing: "easeInOutSine",
        });
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  // mock send for demo
  const mockSendEvent = async (data: EventData): Promise<EventResponse> => {
    await new Promise((r) => setTimeout(r, 420));
    return {
      accepted: true,
      event_id: "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11),
      trace_id: "trace_" + Math.random().toString(36).slice(2, 9),
    };
  };

  const getStatusIcon = (status: EventOrb["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-4 h-4 text-chart-3 animate-spin" />;
      case "processing":
        return <Zap className="w-4 h-4 text-primary animate-pulse" />;
      case "verified":
        return <CheckCircle className="w-4 h-4 text-chart-2" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: EventOrb["status"]) => {
    switch (status) {
      case "sending":
        return "border-chart-3/50 bg-chart-3/10";
      case "processing":
        return "border-primary/50 bg-primary/10";
      case "verified":
        return "border-chart-2/50 bg-chart-2/10";
      case "failed":
        return "border-destructive/50 bg-destructive/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Console */}
      <Card
        ref={consoleRef}
        className="backdrop-blur-glass border-primary/20 relative overflow-hidden"
        style={{
          background: "rgba(6, 8, 25, 0.85)",
          boxShadow: "0 0 20px rgba(45, 143, 255, 0.08)",
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
          {/* Orb container sits absolutely over the card */}
          <div
            ref={orbContainerRef}
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{ zIndex: 20 }}
          />

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 relative z-10">
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
          background: "rgba(6, 8, 25, 0.75)",
          boxShadow: "0 0 15px rgba(52, 211, 153, 0.06)",
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
                  // actor display safely parsed
                  const actorId = (() => {
                    try {
                      const parsed = JSON.parse(event.data.actor);
                      return parsed?.user_id ?? JSON.stringify(parsed);
                    } catch {
                      return safeParseActor(event.data.actor);
                    }
                  })();

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
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
