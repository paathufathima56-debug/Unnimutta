import { ACHIEVEMENTS } from '@/lib/achievements'

export function Achievement({ name }: { name: string }) {
  const a = ACHIEVEMENTS[name] ?? { name, description: '' }
  return (
    <div className="animate-pop-in mx-auto flex max-w-sm items-center gap-4 rounded-3xl border-2 border-yolk bg-gradient-to-br from-white to-cream p-4 sticker-shadow">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-yolk text-3xl shadow-inner">
        🏆
      </div>
      <div className="text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-accent">
          Achievement unlocked
        </p>
        <p className="font-display text-xl font-extrabold text-brown">{a.name}</p>
        <p className="text-sm text-muted-foreground">{a.description}</p>
      </div>
    </div>
  )
}
