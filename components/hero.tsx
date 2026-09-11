'use client'

import { useApp } from './app-context'
import { ChickMascot } from './chick-mascot'
import { Egg } from './egg'

export function Hero() {
  const { navigate, sfx } = useApp()

  return (
    <section className="relative overflow-hidden">
      {/* floating decorative yolks */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-16 animate-float-slow opacity-70">
          <Egg size={70} double={false} />
        </div>
        <div className="absolute right-[8%] top-24 animate-float-slow opacity-70" style={{ animationDelay: '1.2s' }}>
          <div className="egg-shape h-10 w-8 bg-yolk" />
        </div>
        <div className="absolute bottom-10 left-[16%] animate-float-slow opacity-60" style={{ animationDelay: '2s' }}>
          <div className="egg-shape h-8 w-6 bg-orange-accent/70" />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <span className="inline-block rounded-full bg-orange-accent/15 px-4 py-1 text-sm font-extrabold text-orange-accent">
            Taking eggs way too seriously
          </span>
          <h1 className="mt-4 font-display text-6xl font-extrabold leading-none tracking-tight text-brown sm:text-7xl">
            UNNIMUTTA
          </h1>
          <p className="mt-3 font-display text-xl font-bold text-brown/80 sm:text-2xl">
            The unnecessarily serious double-yolk analyzer.
          </p>
          <p className="mx-auto mt-4 max-w-md text-pretty text-base text-muted-foreground md:mx-0">
            Upload a double-yolk egg. Measure the yolks. Compare them. Discover
            absolutely critical information.
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:justify-start">
            <button
              type="button"
              onClick={() => { sfx('pop'); navigate('analyze') }}
              className="group rounded-full bg-yolk px-7 py-3.5 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              <span className="inline-block transition-transform group-hover:scale-110">🥚</span> Analyze My Egg
            </button>
            <button
              type="button"
              onClick={() => { sfx('click'); navigate('leaderboard') }}
              className="rounded-full border-2 border-brown/15 bg-white px-7 py-3.5 text-lg font-extrabold text-brown transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              🏆 View Leaderboard
            </button>
          </div>

          <p className="handwritten mt-6 text-lg font-bold text-orange-accent">
            Important research. Probably.
          </p>
        </div>

        {/* mascot + egg scene */}
        <div className="relative flex items-center justify-center">
          <div className="egg-shape absolute h-64 w-64 bg-gradient-to-b from-yolk/40 to-orange-accent/20 blur-2xl" aria-hidden />
          <div className="relative flex flex-col items-center">
            <ChickMascot expression="scientist" size={220} />
            <div className="-mt-6">
              <Egg size={180} title="A double-yolk egg specimen" />
            </div>
            <span className="handwritten mt-2 rounded-full bg-white px-3 py-1 text-sm font-bold text-brown shadow-sm">
              Specimen #001
            </span>
          </div>
        </div>
      </div>

      <div className="border-y-2 border-brown/10 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-center text-sm font-bold text-brown/70">
          <span>Because apparently, humanity needed to know.</span>
          <span className="hidden sm:inline">•</span>
          <span>100% egg-based science.</span>
          <span className="hidden sm:inline">•</span>
          <span>No eggs were harmed. Mostly.</span>
        </div>
      </div>
    </section>
  )
}
