'use client'

import { useCallback, useRef, useState } from 'react'
import { Plus, Minus, RotateCcw, Lock, Scale } from 'lucide-react'
import type { Circle } from '@/lib/types'
import { circleToDiameterMm, compareYolks, formatMm, type ComparisonOutput } from '@/lib/measurement'
import { DraggableCircle } from './draggable-circle'
import { ChickMascot } from './chick-mascot'
import { useApp } from './app-context'

interface MeasurementToolProps {
  image: string
  onComplete: (result: ComparisonOutput, calibrated: boolean) => void
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function MeasurementTool({ image, onComplete }: MeasurementToolProps) {
  const { sfx } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  const getRect = useCallback(() => containerRef.current?.getBoundingClientRect() ?? null, [])

  const [coin, setCoin] = useState<Circle>({ x: 0.22, y: 0.5, r: 0.1 })
  const [current, setCurrent] = useState<Circle>({ x: 0.55, y: 0.42, r: 0.13 })
  const [target, setTarget] = useState<'coin' | 'yolk'>('yolk')
  const [calibrated, setCalibrated] = useState(false)

  const [yolk1, setYolk1] = useState<{ circle: Circle; d: number } | null>(null)
  const [yolk2, setYolk2] = useState<{ circle: Circle; d: number } | null>(null)
  const [note, setNote] = useState<string | null>(null)

  const step = !yolk1 ? 1 : !yolk2 ? 2 : 3
  const liveDiameter = circleToDiameterMm(current, coin)

  const adjust = (delta: number) => {
    sfx('click')
    if (target === 'coin') {
      setCoin((c) => ({ ...c, r: clamp(c.r + delta, 0.02, 0.5) }))
    } else {
      setCurrent((c) => ({ ...c, r: clamp(c.r + delta, 0.02, 0.5) }))
    }
  }

  const reset = () => {
    sfx('confirm')
    setNote('We have returned to the beginning of egg.')
    if (target === 'coin') setCoin({ x: 0.22, y: 0.5, r: 0.1 })
    else setCurrent({ x: 0.55, y: step === 2 ? 0.6 : 0.42, r: 0.13 })
    window.setTimeout(() => setNote(null), 2200)
  }

  const lockYolk = () => {
    sfx('confirm')
    if (step === 1) {
      setYolk1({ circle: current, d: liveDiameter })
      setNote('The yolk has been documented.')
      setCurrent({ x: 0.68, y: 0.6, r: 0.12 })
    } else if (step === 2) {
      setYolk2({ circle: current, d: liveDiameter })
      setNote('The yolk has been documented.')
    }
    window.setTimeout(() => setNote(null), 2200)
  }

  const compare = () => {
    if (!yolk1 || !yolk2) return
    sfx('pop')
    onComplete(compareYolks(yolk1.d, yolk2.d), calibrated)
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* header + steps */}
      <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <ChickMascot expression="scientist" size={84} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-3xl font-extrabold text-brown">
            Now let&apos;s measure something completely unnecessary.
          </h2>
          <ol className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            {[
              { n: 1, label: 'Measure Yolk 1' },
              { n: 2, label: 'Measure Yolk 2' },
              { n: 3, label: 'Compare them' },
            ].map((s) => (
              <li
                key={s.n}
                className={[
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold',
                  step === s.n
                    ? 'bg-yolk text-brown shadow-sm'
                    : step > s.n
                      ? 'bg-green-100 text-green-800'
                      : 'bg-cream text-brown/50',
                ].join(' ')}
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-white/70 text-xs">
                  {step > s.n ? '✓' : s.n}
                </span>
                {s.label}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* workspace */}
        <div>
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-3xl border-2 border-brown/10 bg-cream soft-shadow"
            style={{ touchAction: 'none' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || '/placeholder.svg'}
              alt="Egg specimen in the measurement workspace"
              className="pointer-events-none block max-h-[60vh] w-full object-contain"
              draggable={false}
            />

            {/* locked yolks stay visible */}
            {yolk1 && (
              <DraggableCircle
                circle={yolk1.circle}
                onChange={() => {}}
                getRect={getRect}
                variant="yolk"
                label="Yolk 1 ✓"
                interactive={false}
                locked
                zIndex={8}
              />
            )}
            {yolk2 && (
              <DraggableCircle
                circle={yolk2.circle}
                onChange={() => {}}
                getRect={getRect}
                variant="yolk"
                label="Yolk 2 ✓"
                interactive={false}
                locked
                zIndex={8}
              />
            )}

            {/* active yolk being measured */}
            {step < 3 && (
              <DraggableCircle
                circle={current}
                onChange={setCurrent}
                getRect={getRect}
                variant="yolk"
                label={`Yolk ${step}`}
                zIndex={20}
              />
            )}

            {/* reference coin always on top */}
            <DraggableCircle
              circle={coin}
              onChange={setCoin}
              getRect={getRect}
              variant="coin"
              label="₹10 reference"
              zIndex={30}
            />
          </div>

          {note && (
            <p className="animate-fade-up mt-2 text-center handwritten text-base font-bold text-orange-accent">
              {note}
            </p>
          )}
        </div>

        {/* controls */}
        <aside className="space-y-4">
          {/* target selector */}
          <div className="rounded-2xl border-2 border-brown/10 bg-white p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Adjusting
            </p>
            <div className="grid grid-cols-2 gap-1 rounded-full bg-cream p-1">
              {(['yolk', 'coin'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={[
                    'rounded-full px-3 py-1.5 text-sm font-bold capitalize transition-colors',
                    target === t ? 'bg-yolk text-brown shadow-sm' : 'text-brown/60',
                  ].join(' ')}
                >
                  {t === 'yolk' ? `Yolk ${step < 3 ? step : ''}` : '₹10 Coin'}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => adjust(0.008)} aria-label="Zoom in" className="control-btn">
                <Plus className="size-4" /> In
              </button>
              <button type="button" onClick={() => adjust(-0.008)} aria-label="Zoom out" className="control-btn">
                <Minus className="size-4" /> Out
              </button>
              <button type="button" onClick={reset} aria-label="Reset" className="control-btn">
                <RotateCcw className="size-4" /> Reset
              </button>
            </div>
          </div>

          {/* calibration */}
          <label className="flex cursor-pointer items-start gap-2 rounded-2xl border-2 border-brown/10 bg-white p-3">
            <input
              type="checkbox"
              checked={calibrated}
              onChange={(e) => setCalibrated(e.target.checked)}
              className="mt-0.5 size-4 accent-orange-accent"
            />
            <span className="text-xs text-brown/80">
              <span className="font-bold text-brown">My photo has a real ₹10 coin.</span> I&apos;ve
              placed the reference circle exactly over it to calibrate scale.
            </span>
          </label>

          {/* live readout */}
          <div className="rounded-2xl border-2 border-yolk bg-cream p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {step < 3 ? `Yolk ${step} diameter` : 'Comparison ready'}
            </p>
            {step < 3 ? (
              <p className="font-display text-4xl font-extrabold text-brown">
                {formatMm(liveDiameter)}
              </p>
            ) : (
              <p className="font-display text-2xl font-extrabold text-brown">All set ⚖️</p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">
              {calibrated ? 'Calibrated estimate' : 'Approximate visual estimate'}
            </p>
          </div>

          {/* action */}
          {step < 3 ? (
            <button
              type="button"
              onClick={lockYolk}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-yolk px-5 py-3.5 text-lg font-extrabold text-brown shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
            >
              <Lock className="size-5" /> Lock Yolk {step}
            </button>
          ) : (
            <button
              type="button"
              onClick={compare}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-accent px-5 py-3.5 text-lg font-extrabold text-white shadow-lg sticker-shadow transition-transform hover:-translate-y-1"
            >
              <Scale className="size-5" /> Compare Yolks
            </button>
          )}

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            This is an approximate visual measurement based on image scale and the ₹10
            reference (27&nbsp;mm). It is not a laboratory measurement.
          </p>
        </aside>
      </div>
    </div>
  )
}
