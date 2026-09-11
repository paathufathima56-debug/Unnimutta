'use client'

import { useEffect, useRef, useState } from 'react'
import { ChickMascot } from './chick-mascot'
import { useApp } from './app-context'

/**
 * CHICKEN CLICKER TRAP — intentionally a self-contained module so its game
 * mechanics can be swapped or expanded later without touching the egg analyzer.
 * The current build ships a small but real 15-second clicker as a teaser.
 */
export function ClickerTrap() {
  const { sfx } = useApp()
  const [playing, setPlaying] = useState(false)
  const [count, setCount] = useState(0)
  const [best, setBest] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [poke, setPoke] = useState(false)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const countRef = useRef(0)

  useEffect(() => () => { if (interval.current) clearInterval(interval.current) }, [])

  const start = () => {
    sfx('pop')
    countRef.current = 0
    setCount(0)
    setTimeLeft(15)
    setPlaying(true)
    if (interval.current) clearInterval(interval.current)
    interval.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (interval.current) clearInterval(interval.current)
          setPlaying(false)
          const final = countRef.current
          setBest((b) => {
            if (final > b) sfx('achievement')
            return Math.max(b, final)
          })
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const peck = () => {
    if (!playing) return
    sfx('click')
    countRef.current += 1
    setCount(countRef.current)
    setPoke(true)
    window.setTimeout(() => setPoke(false), 90)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 text-center">
      <h1 className="font-display text-4xl font-extrabold text-brown">🐔 CHICKEN CLICKER TRAP</h1>

      {!playing && count === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-brown/20 bg-white p-10">
          <ChickMascot expression="confused" size={130} />
          <p className="mt-4 handwritten text-xl font-bold text-orange-accent">
            Something suspicious is happening here…
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            A prototype game trap. Peck the chicken as many times as you can before the
            timer runs out. More elaborate mechanics are coming later.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-6 rounded-full bg-yolk px-8 py-3.5 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
          >
            PLAY CLICKER TRAP
          </button>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border-2 border-brown/10 bg-white p-8 soft-shadow">
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Pecks</p>
              <p className="font-display text-5xl font-extrabold text-brown">{count}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Time</p>
              <p className="font-display text-5xl font-extrabold text-orange-accent">{timeLeft}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={peck}
            disabled={!playing}
            aria-label="Peck the chicken"
            className="mx-auto mt-6 block rounded-full transition-transform active:scale-95 disabled:opacity-70"
          >
            <ChickMascot expression={playing ? 'happy' : 'proud'} size={160} idle={false} dancing={poke} />
          </button>

          {!playing && (
            <div className="mt-4">
              <p className="font-display text-xl font-extrabold text-brown">
                Time&apos;s up! You pecked {count} times.
              </p>
              <p className="text-sm text-muted-foreground">Best this session: {Math.max(best, count)}</p>
              <button
                type="button"
                onClick={start}
                className="mt-4 rounded-full bg-yolk px-7 py-3 font-extrabold text-brown shadow-md transition-transform hover:-translate-y-1"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
