'use client'

import { useEffect, useRef, useState } from 'react'
import type { EggScore as EggScoreType } from '@/lib/scoring'
import { ChickMascot } from './chick-mascot'
import { useApp } from './app-context'

interface EggScoreProps {
  image: string
  score: EggScoreType
  onContinue: () => void
}

export function EggScore({ image, score, onContinue }: EggScoreProps) {
  const { sfx } = useApp()
  const [display, setDisplay] = useState(0)
  const played = useRef(false)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const duration = 1100
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * score.score))
      if (t < 1) raf = requestAnimationFrame(tick)
      else if (!played.current) {
        played.current = true
        sfx(score.tier === 'low' ? 'different' : 'achievement')
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [score, sfx])

  const chickExpr = score.tier === 'high' ? 'proud' : score.tier === 'low' ? 'disappointed' : 'happy'

  return (
    <div className="mx-auto max-w-2xl animate-fade-up text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-orange-accent">
        Give the egg a score
      </p>
      <h2 className="mt-1 font-display text-3xl font-extrabold text-brown">
        EGG DOCUMENTATION SCORE
      </h2>

      <div className="mt-6 flex flex-col items-center gap-6 rounded-3xl border-2 border-brown/10 bg-white p-6 soft-shadow sm:flex-row sm:text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || '/placeholder.svg'}
          alt="Scored egg specimen"
          className="size-32 shrink-0 rounded-2xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-end justify-center gap-1 sm:justify-start">
            <span className="font-display text-6xl font-extrabold leading-none text-brown">
              {display}
            </span>
            <span className="mb-1 text-2xl font-extrabold text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-2 text-pretty font-bold text-brown/80">{score.message}</p>

          <ul className="mt-4 space-y-1.5">
            {score.breakdown.map((b) => (
              <li key={b.label} className="flex items-center gap-2 text-xs">
                <span className="w-28 shrink-0 text-muted-foreground">{b.label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                  <span
                    className="block h-full rounded-full bg-yolk"
                    style={{ width: `${(b.points / b.max) * 100}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right font-bold text-brown">
                  {b.points}/{b.max}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ChickMascot expression={chickExpr} size={90} />
      </div>

      <p className="mx-auto mt-4 max-w-md text-xs text-muted-foreground">
        This is a playful documentation score based on your image — not a scientific
        detection of double yolks.
      </p>

      <button
        type="button"
        onClick={() => { sfx('pop'); onContinue() }}
        className="mt-6 rounded-full bg-yolk px-8 py-3.5 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
      >
        Continue to Measurement →
      </button>
    </div>
  )
}
