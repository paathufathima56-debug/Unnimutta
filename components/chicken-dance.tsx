'use client'

import { useEffect, useRef, useState } from 'react'
import { ChickMascot } from './chick-mascot'
import { useApp } from './app-context'

export function ChickenDance() {
  const { sfx } = useApp()
  const [dancing, setDancing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const dance = () => {
    sfx('dance')
    setDancing(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDancing(false), 5000)
  }

  return (
    <div className="rounded-3xl border-2 border-brown/10 bg-gradient-to-b from-white to-cream p-6 text-center">
      <h3 className="font-display text-2xl font-extrabold text-brown">
        YOU EARNED THE CHICKEN DANCE 🐔
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A reward for your tremendous contribution to egg science.
      </p>

      <div className="my-4 flex h-40 items-end justify-center gap-2">
        <ChickMascot expression="dancing" size={140} dancing={dancing} idle={!dancing} />
      </div>

      <button
        type="button"
        onClick={dance}
        className="rounded-full bg-yolk px-7 py-3 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1 active:translate-y-0"
      >
        🐔 {dancing ? 'DANCING!' : 'MAKE THE CHICKEN DANCE'}
      </button>
    </div>
  )
}
