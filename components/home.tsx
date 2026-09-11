'use client'

import { Hero } from './hero'
import { useApp } from './app-context'
import { ChickMascot } from './chick-mascot'

const JOURNEY = [
  { emoji: '📷', title: 'Show us your egg', desc: 'Upload or snap a double-yolk egg.' },
  { emoji: '💯', title: 'Give the egg a score', desc: 'Earn an egg documentation score.' },
  { emoji: '📏', title: 'Measure the unnecessary', desc: 'Place the ₹10 coin and measure both yolks.' },
  { emoji: '⚖️', title: 'The moment of truth', desc: 'Same size? Different? Find out dramatically.' },
  { emoji: '🐔', title: 'Earn the chicken dance', desc: 'A well-deserved, ridiculous reward.' },
]

export function Home() {
  const { navigate, sfx } = useApp()
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center font-display text-3xl font-extrabold text-brown sm:text-4xl">
          The completely unnecessary journey
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
          Every stage is designed to make you curious about what absurd thing happens next.
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {JOURNEY.map((s, i) => (
            <li
              key={s.title}
              className="animate-fade-up relative rounded-3xl border-2 border-brown/10 bg-white p-5 text-center soft-shadow"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-accent px-2.5 py-0.5 text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <div className="text-4xl">{s.emoji}</div>
              <h3 className="mt-2 font-display text-lg font-extrabold text-brown">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-center gap-6 rounded-4xl border-2 border-brown/10 bg-gradient-to-br from-yolk/30 to-cream p-8 text-center sm:flex-row sm:text-left">
          <ChickMascot expression="happy" size={120} />
          <div className="flex-1">
            <h2 className="font-display text-3xl font-extrabold text-brown">
              We took eggs way too seriously.
            </h2>
            <p className="mt-2 text-brown/80">
              And we&apos;d do it again. Ready to contribute to critical yolk research?
            </p>
          </div>
          <button
            type="button"
            onClick={() => { sfx('pop'); navigate('analyze') }}
            className="rounded-full bg-yolk px-8 py-3.5 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
          >
            🥚 Analyze My Egg
          </button>
        </div>
      </section>
    </>
  )
}
