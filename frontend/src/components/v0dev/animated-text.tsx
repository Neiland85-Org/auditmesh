"use client"

import { useEffect, useRef } from "react"
import anime from "animejs"

interface AnimatedTextProps {
  text: string
  className?: string
  animation?: "fadeInUp" | "staggerLetters" | "typewriter" | "glow"
  delay?: number
}

export function AnimatedText({ text, className = "", animation = "fadeInUp", delay = 0 }: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const element = textRef.current

    switch (animation) {
      case "staggerLetters":
        // Split text into individual letters
        element.innerHTML = text
          .split("")
          .map((char, i) =>
            char === " "
              ? '<span class="inline-block">&nbsp;</span>'
              : `<span class="inline-block opacity-0 translate-y-4">${char}</span>`,
          )
          .join("")

        anime({
          targets: element.querySelectorAll("span"),
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(50, { start: delay }),
          duration: 600,
          easing: "easeOutExpo",
        })
        break

      case "typewriter":
        element.innerHTML = ""
        const chars = text.split("")

        anime({
          targets: {},
          duration: text.length * 100,
          delay,
          easing: "linear",
          update: (anim) => {
            const progress = Math.round((anim.progress * chars.length) / 100)
            element.innerHTML =
              chars.slice(0, progress).join("") + (anim.progress < 100 ? '<span class="animate-pulse">|</span>' : "")
          },
        })
        break

      case "glow":
        anime({
          targets: element,
          opacity: [0, 1],
          scale: [0.8, 1],
          textShadow: [
            "0 0 0px rgba(59, 130, 246, 0)",
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 0px rgba(59, 130, 246, 0)",
          ],
          delay,
          duration: 1200,
          easing: "easeOutExpo",
        })
        break

      default: // fadeInUp
        anime({
          targets: element,
          opacity: [0, 1],
          translateY: [30, 0],
          delay,
          duration: 800,
          easing: "easeOutExpo",
        })
    }
  }, [text, animation, delay])

  return (
    <div ref={textRef} className={className} style={{ opacity: 0 }}>
      {text}
    </div>
  )
}
