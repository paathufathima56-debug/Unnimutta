'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useApp } from './app-context'

export function SoundToggle({ className }: { className?: string }) {
  const { soundEnabled, toggleSound } = useApp()
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
      title={soundEnabled ? 'Sound is ON' : 'Sound is OFF'}
      className={[
        'inline-flex items-center gap-1.5 rounded-full border-2 border-brown/15 bg-white px-3 py-1.5 text-sm font-bold text-brown shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0',
        className ?? '',
      ].join(' ')}
    >
      {soundEnabled ? (
        <Volume2 className="size-4 text-orange-accent" />
      ) : (
        <VolumeX className="size-4 text-muted-foreground" />
      )}
      <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
    </button>
  )
}
