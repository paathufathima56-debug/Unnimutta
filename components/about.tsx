'use client'

import { ChickMascot } from './chick-mascot'
import { Egg } from './egg'
import { useApp } from './app-context'

const EXPLORES = [
  'UI / UX design',
  'Interactive image manipulation',
  'Visual measurement math',
  'Browser APIs (camera, canvas)',
  'LocalStorage persistence',
  'Gamification',
  'Animation',
  'Fun software design',
]

export function About() {
  const { navigate, sfx } = useApp()
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-end gap-2">
          <ChickMascot expression="scientist" size={90} />
          <Egg size={80} />
        </div>
        <h1 className="font-display text-4xl font-extrabold text-brown">
          Why does Unnimutta exist?
        </h1>
      </header>

      <div className="mt-8 space-y-5 text-pretty text-lg leading-relaxed text-brown/80">
        <p>
          Unnimutta started from a completely unnecessary question:
        </p>
        <p className="rounded-3xl border-2 border-yolk bg-cream p-5 text-center font-display text-xl font-extrabold text-brown">
          Are the two yolks of a double-yolk egg actually the same size?
        </p>
        <p>
          Instead of simply accepting that nobody needed to know, we built an entire
          interactive experience around it. There are measurements. There is a coin.
          There is drama. There is, inexplicably, a chicken dance.
        </p>
        <p>Along the way, the project explores:</p>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
        {EXPLORES.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-2xl border-2 border-brown/10 bg-white px-4 py-3 font-bold text-brown"
          >
            <span className="text-orange-accent">🥚</span> {item}
          </li>
        ))}
      </ul>

      <blockquote className="mt-8 rounded-3xl bg-brown p-6 text-center text-white">
        <p className="font-display text-2xl font-extrabold">Was this necessary? No.</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-yolk">
          Was it fun to build? Absolutely.
        </p>
      </blockquote>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => { sfx('pop'); navigate('analyze') }}
          className="rounded-full bg-yolk px-8 py-3.5 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
        >
          🥚 Fine, Analyze My Egg
        </button>
      </div>
    </section>
  )
}
