'use client'

import { useApp } from './app-context'
import { Egg } from './egg'

export function EggGallery() {
  const { results } = useApp()
  const withImages = results.filter((r) => r.eggImage)
  const gallery = withImages.length > 0 ? withImages : results.slice(0, 8)

  return (
    <section className="mt-14">
      <h2 className="text-center font-display text-3xl font-extrabold text-brown">Egg Gallery</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Documented specimens from the local archive.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((r) => (
          <figure
            key={r.id}
            className="overflow-hidden rounded-3xl border-2 border-brown/10 bg-white p-3 transition-transform hover:-translate-y-1 soft-shadow"
          >
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-cream">
              {r.eggImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.eggImage || '/placeholder.svg'}
                  alt={`Egg specimen by ${r.username}`}
                  className="size-full object-cover"
                />
              ) : (
                <Egg size={96} title={`Placeholder specimen for ${r.username}`} />
              )}
            </div>
            <figcaption className="mt-3">
              <p className="flex items-center justify-between gap-2">
                <span className="truncate font-display font-extrabold text-brown">{r.username}</span>
                {r.isEqual && <span title="Perfect Yolk Ratio">🏆</span>}
              </p>
              <p className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Score {r.eggScore}</span>
                <span>Ratio {r.ratio}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {new Date(r.date).toLocaleDateString()}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
