'use client'

import { useEffect, useRef, useState } from 'react'
import { ChickMascot } from './chick-mascot'
import { SoundToggle } from './sound-toggle'
import { useApp } from './app-context'

type Phase = 'windup' | 'swing' | 'fly' | 'splash' | 'done'

export function IntroAnimation({ onFinish }: { onFinish: () => void }) {
  const { sfx } = useApp()
  const [phase, setPhase] = useState<Phase>('windup')
  const finished = useRef(false)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish()
  }

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => { setPhase('swing'); sfx('swing') }, 600))
    timers.push(setTimeout(() => { setPhase('fly'); sfx('impact') }, 1150))
    timers.push(setTimeout(() => sfx('whoosh'), 1300))
    timers.push(setTimeout(() => { setPhase('splash'); sfx('splash') }, 2300))
    timers.push(setTimeout(() => setPhase('done'), 3100))
    timers.push(setTimeout(finish, 3500))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-cream to-[#fff2b8]"
      role="dialog"
      aria-label="Unnimutta intro animation"
    >
      {/* controls */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <SoundToggle />
        <button
          type="button"
          onClick={finish}
          className="rounded-full bg-brown px-4 py-1.5 text-sm font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5"
        >
          Skip Intro
        </button>
      </div>

      <p className="absolute top-6 left-1/2 -translate-x-1/2 handwritten text-lg font-bold text-orange-accent">
        Important research. Probably.
      </p>

      {/* stage */}
      <div className="relative h-[340px] w-full max-w-2xl">
        {/* chick + racket */}
        {phase !== 'splash' && phase !== 'done' && (
          <div className="absolute bottom-8 left-6 sm:left-16">
            <div className="relative">
              <ChickMascot expression="serious" size={150} idle={false} />
              {/* tennis racket */}
              <svg
                viewBox="0 0 120 200"
                width={90}
                height={150}
                className="absolute -right-10 top-2 origin-bottom"
                style={{
                  animation:
                    phase === 'swing' || phase === 'fly'
                      ? 'racket-swing 0.5s ease-in forwards'
                      : 'none',
                  transform: 'rotate(60deg)',
                }}
                aria-hidden="true"
              >
                <rect x="52" y="70" width="14" height="120" rx="7" fill="#b5721f" />
                <ellipse cx="59" cy="44" rx="42" ry="50" fill="none" stroke="#d98a24" strokeWidth="12" />
                <g stroke="#f6d98a" strokeWidth="2">
                  <path d="M30 44 h58 M35 24 h48 M35 64 h48" />
                  <path d="M45 8 v72 M59 4 v78 M73 8 v72" />
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* flying egg */}
        {(phase === 'windup' || phase === 'swing' || phase === 'fly') && (
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              animation: phase === 'fly' ? 'egg-fly 1.15s ease-in forwards' : 'none',
              transform: 'translate(-40vw, 10vh) scale(0.4)',
            }}
          >
            <div className="egg-shape h-24 w-20 bg-gradient-to-b from-white to-[#fff2c0] shadow-lg sticker-shadow" />
          </div>
        )}

        {/* headline */}
        {phase === 'windup' && (
          <h1 className="animate-fade-up absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-3xl font-extrabold text-brown sm:text-5xl">
            UNNIMUTTA
          </h1>
        )}
      </div>

      {/* yellow paint splash */}
      {(phase === 'splash' || phase === 'done') && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="egg-shape bg-[#ffd21f]"
            style={{
              width: 60,
              height: 60,
              animation: 'splash-grow 0.8s cubic-bezier(0.5,0,0.3,1) forwards',
            }}
          />
        </div>
      )}
      {phase === 'done' && (
        <h1 className="animate-pop-in absolute z-20 font-display text-5xl font-extrabold text-brown sm:text-7xl">
          UNNIMUTTA
        </h1>
      )}
    </div>
  )
}
