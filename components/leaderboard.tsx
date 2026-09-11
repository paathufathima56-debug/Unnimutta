'use client'

import { useMemo, useState } from 'react'
import { useApp } from './app-context'
import { ChickMascot } from './chick-mascot'
import { EggGallery } from './egg-gallery'

type SortKey = 'score' | 'perfect'

export function Leaderboard() {
  const { results, navigate, sfx } = useApp()
  const [sort, setSort] = useState<SortKey>('score')

  const sorted = useMemo(() => {
    const copy = [...results]
    if (sort === 'perfect') {
      copy.sort((a, b) => a.difference - b.difference || b.eggScore - a.eggScore)
    } else {
      copy.sort((a, b) => b.eggScore - a.eggScore || a.difference - b.difference)
    }
    return copy
  }, [results, sort])

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <ChickMascot expression="proud" size={90} />
        <h1 className="font-display text-4xl font-extrabold text-brown">🏆 Leaderboard</h1>
        <p className="max-w-md text-muted-foreground">
          The finest egg scientists, ranked by absolutely critical metrics. Demo
          entries below are fictional characters, not real people.
        </p>
      </header>

      <div className="mt-6 flex justify-center gap-1 rounded-full bg-cream p-1">
        {([
          ['score', 'Top Egg Score'],
          ['perfect', 'Closest to Perfect'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => { sfx('click'); setSort(key) }}
            className={[
              'rounded-full px-4 py-2 text-sm font-bold transition-colors',
              sort === key ? 'bg-yolk text-brown shadow-sm' : 'text-brown/60',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border-2 border-brown/10 bg-white soft-shadow">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="bg-cream text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-bold">#</th>
              <th className="px-4 py-3 font-bold">Scientist</th>
              <th className="px-4 py-3 text-right font-bold">Egg Score</th>
              <th className="px-4 py-3 text-right font-bold">Yolk 1</th>
              <th className="px-4 py-3 text-right font-bold">Yolk 2</th>
              <th className="px-4 py-3 text-right font-bold">Ratio</th>
              <th className="px-4 py-3 text-center font-bold">Perfect?</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const isLocal = !r.id.startsWith('demo-')
              return (
                <tr
                  key={r.id}
                  className={[
                    'border-t border-brown/5 text-sm',
                    isLocal ? 'bg-yolk/10 font-bold' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 font-display text-lg font-extrabold text-brown/70">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-brown">{r.username}</span>
                    {isLocal && (
                      <span className="ml-2 rounded-full bg-orange-accent/20 px-2 py-0.5 text-[10px] font-bold text-orange-accent">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-display text-lg font-extrabold text-brown">
                    {r.eggScore}
                  </td>
                  <td className="px-4 py-3 text-right text-brown/80">{r.yolk1Diameter.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-brown/80">{r.yolk2Diameter.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-brown/80">{r.ratio}</td>
                  <td className="px-4 py-3 text-center">
                    {r.isEqual ? <span title="Perfect Yolk Ratio">🏆</span> : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => { sfx('pop'); navigate('analyze') }}
          className="rounded-full bg-yolk px-7 py-3 font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
        >
          🥚 Analyze an Egg
        </button>
      </div>

      <EggGallery />
    </section>
  )
}
