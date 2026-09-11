'use client'

import { useApp, type AppView } from './app-context'

const LINKS: { label: string; view: AppView }[] = [
  { label: 'Home', view: 'home' },
  { label: 'Analyze Egg', view: 'analyze' },
  { label: 'Leaderboard', view: 'leaderboard' },
  { label: 'Chicken Game', view: 'game' },
  { label: 'About', view: 'about' },
]

export function Footer() {
  const { navigate, sfx } = useApp()
  return (
    <footer className="border-t-2 border-brown/10 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center">
        <p className="font-display text-2xl font-extrabold text-brown">UNNIMUTTA</p>
        <p className="text-sm text-muted-foreground">
          The unnecessarily serious double-yolk analyzer. Taking eggs way too seriously.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <button
              key={l.view}
              type="button"
              onClick={() => { sfx('click'); navigate(l.view) }}
              className="text-sm font-bold text-brown/70 hover:text-brown"
            >
              {l.label}
            </button>
          ))}
        </nav>
        <p className="handwritten text-sm font-bold text-orange-accent">
          Was it necessary? No. Was it fun? Absolutely.
        </p>
      </div>
    </footer>
  )
}
