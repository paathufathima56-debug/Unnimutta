'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useApp, type AppView } from './app-context'
import { SoundToggle } from './sound-toggle'
import { ChickMascot } from './chick-mascot'

const LINKS: { label: string; view: AppView }[] = [
  { label: 'Home', view: 'home' },
  { label: 'Analyze Egg', view: 'analyze' },
  { label: 'Leaderboard', view: 'leaderboard' },
  { label: 'Chicken Game', view: 'game' },
  { label: 'About', view: 'about' },
]

export function Navbar() {
  const { view, navigate, sfx } = useApp()
  const [open, setOpen] = useState(false)

  const go = (v: AppView) => {
    sfx('click')
    navigate(v)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-brown/10 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5" aria-label="Main">
        <button
          type="button"
          onClick={() => go('home')}
          className="flex items-center gap-2"
          aria-label="Unnimutta home"
        >
          <ChickMascot size={40} idle={false} />
          <span className="font-display text-xl font-extrabold tracking-tight text-brown">
            UNNIMUTTA
          </span>
        </button>

        {/* desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.view}>
              <button
                type="button"
                onClick={() => go(l.view)}
                aria-current={view === l.view ? 'page' : undefined}
                className={[
                  'rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors',
                  view === l.view
                    ? 'bg-yolk text-brown shadow-sm'
                    : 'text-brown/70 hover:bg-cream hover:text-brown',
                ].join(' ')}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li className="ml-2">
            <SoundToggle />
          </li>
        </ul>

        {/* mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <SoundToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-full border-2 border-brown/15 bg-white p-2 text-brown"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <ul className="flex flex-col gap-1 border-t-2 border-brown/10 bg-white px-4 py-3 md:hidden">
          {LINKS.map((l) => (
            <li key={l.view}>
              <button
                type="button"
                onClick={() => go(l.view)}
                aria-current={view === l.view ? 'page' : undefined}
                className={[
                  'w-full rounded-2xl px-4 py-3 text-left text-base font-bold transition-colors',
                  view === l.view ? 'bg-yolk text-brown' : 'text-brown/80 hover:bg-cream',
                ].join(' ')}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
