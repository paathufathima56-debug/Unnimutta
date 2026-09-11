'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  vrot: number
  color: string
}

const COLORS = ['#ffd21f', '#f6b93b', '#ff924c', '#fff3c4', '#ffe27a']

/** Lightweight canvas confetti burst. Renders once then cleans itself up. */
export function Confetti({ duration = 2600 }: { duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = ref.current
    if (!canvas || prefersReduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = (canvas.width = window.innerWidth * dpr)
    const h = (canvas.height = window.innerHeight * dpr)
    ctx.scale(dpr, dpr)
    const vw = window.innerWidth
    const vh = window.innerHeight

    const particles: Particle[] = Array.from({ length: 160 }, () => ({
      x: vw / 2 + (Math.random() - 0.5) * vw * 0.6,
      y: vh * 0.35 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.vy += 0.35
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.rot += p.vrot
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })
      if (elapsed < duration) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
