'use client'

import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy, Camera, Check } from 'lucide-react'
import type { ComparisonOutput } from '@/lib/measurement'
import { formatMm } from '@/lib/measurement'
import { achievementFor } from '@/lib/achievements'
import type { UserResult } from '@/lib/types'
import { compressImage } from '@/lib/storage'
import { ChickMascot } from './chick-mascot'
import { Confetti } from './confetti'
import { Achievement } from './achievement'
import { ChickenDance } from './chicken-dance'
import { useApp } from './app-context'

interface ComparisonResultProps {
  image: string
  eggScore: number
  comparison: ComparisonOutput
  calibrated: boolean
  onMeasureAgain: () => void
}

export function ComparisonResult({
  image,
  eggScore,
  comparison,
  calibrated,
  onMeasureAgain,
}: ComparisonResultProps) {
  const { sfx, saveResult, navigate } = useApp()
  const { yolk1, yolk2, difference, ratio, isEqual } = comparison
  const achievement = achievementFor(isEqual)

  const [username, setUsername] = useState('')
  const [saved, setSaved] = useState(false)
  const played = useRef(false)

  useEffect(() => {
    if (played.current) return
    played.current = true
    sfx(isEqual ? 'same' : 'different')
  }, [isEqual, sfx])

  const handleSave = () => {
    const name = username.trim()
    if (!name) return
    const result: UserResult = {
      id: `local-${Date.now()}`,
      username: name,
      eggScore,
      yolk1Diameter: yolk1,
      yolk2Diameter: yolk2,
      difference,
      ratio,
      isEqual,
      calibrated,
      achievement,
      eggImage: image,
      date: new Date().toISOString(),
      gameScore: 0,
    }
    saveResult(result)
    setSaved(true)
    sfx('achievement')
  }

  const downloadCard = async () => {
    sfx('pop')
    const thumb = await compressImage(image, 420, 0.8)
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#fffdf5'
    ctx.fillRect(0, 0, 800, 1000)
    ctx.fillStyle = '#ffd21f'
    ctx.fillRect(0, 0, 800, 140)
    ctx.fillStyle = '#3a2a1a'
    ctx.font = '800 56px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('UNNIMUTTA', 400, 90)

    const drawResult = () => {
      ctx.fillStyle = isEqual ? '#2f855a' : '#c05621'
      ctx.font = '800 40px sans-serif'
      ctx.fillText(isEqual ? 'THE YOLKS ARE THE SAME' : 'THE YOLKS ARE NOT THE SAME', 400, 620)

      ctx.fillStyle = '#3a2a1a'
      ctx.font = '700 34px sans-serif'
      ctx.fillText(`Yolk 1:  ${formatMm(yolk1)}`, 400, 700)
      ctx.fillText(`Yolk 2:  ${formatMm(yolk2)}`, 400, 750)
      ctx.fillText(`Difference:  ${formatMm(difference)}`, 400, 800)
      ctx.fillText(`Ratio:  ${ratio}`, 400, 850)
      ctx.fillStyle = '#8a7355'
      ctx.font = '600 22px sans-serif'
      ctx.fillText(
        calibrated ? 'Calibrated estimate' : 'Approximate visual estimate',
        400,
        910,
      )
      ctx.fillText('Taking eggs way too seriously.', 400, 950)

      const link = document.createElement('a')
      link.download = 'unnimutta-result.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    const specimen = new Image()
    specimen.crossOrigin = 'anonymous'
    specimen.onload = () => {
      const size = 400
      const sx = 200
      const sy = 180
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(sx, sy, size, size, 28)
      ctx.clip()
      const ratioImg = Math.max(size / specimen.width, size / specimen.height)
      const w = specimen.width * ratioImg
      const h = specimen.height * ratioImg
      ctx.drawImage(specimen, sx + (size - w) / 2, sy + (size - h) / 2, w, h)
      ctx.restore()
      drawResult()
    }
    specimen.onerror = drawResult
    specimen.src = thumb
  }

  return (
    <div className="mx-auto max-w-3xl">
      {isEqual && <Confetti />}

      {/* dramatic headline */}
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-accent">
          The moment of truth
        </p>
        <div className="my-4 flex justify-center">
          <ChickMascot
            expression={isEqual ? 'proud' : 'shocked'}
            size={140}
            className={isEqual ? '' : 'animate-wiggle'}
          />
        </div>
        <h2
          className={[
            'font-display text-4xl font-extrabold leading-tight sm:text-5xl',
            isEqual ? 'text-green-700' : 'text-orange-accent',
          ].join(' ')}
        >
          {isEqual ? 'THE YOLKS ARE THE SAME SIZE.' : 'THE YOLKS ARE NOT THE SAME.'}
        </h2>
        <p className="mt-3 font-display text-xl font-bold text-brown/80">
          {isEqual ? '“This changes everything.”' : '“They were born different. Respect their individuality.”'}
        </p>
      </div>

      {/* result table */}
      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-brown/10 bg-white soft-shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-cream text-sm uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-bold">Measurement</th>
              <th className="px-5 py-3 text-right font-bold">Result</th>
            </tr>
          </thead>
          <tbody className="font-display">
            {[
              ['Yolk 1', formatMm(yolk1)],
              ['Yolk 2', formatMm(yolk2)],
              ['Difference', formatMm(difference)],
              ['Ratio', ratio],
            ].map(([label, value], i) => (
              <tr key={label} className={i % 2 ? 'bg-cream/40' : ''}>
                <td className="px-5 py-4 text-lg font-bold text-brown/80">{label}</td>
                <td className="px-5 py-4 text-right text-2xl font-extrabold text-brown">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t-2 border-brown/5 px-5 py-2 text-center text-xs text-muted-foreground">
          {calibrated
            ? 'Calibrated against a real ₹10 coin (27 mm). Still just for fun.'
            : 'Approximate visual estimate — not a laboratory measurement.'}
        </p>
      </div>

      {achievement && (
        <div className="mt-8">
          <Achievement name={achievement} />
        </div>
      )}

      {/* chicken dance reward */}
      <div className="mt-8">
        <ChickenDance />
      </div>

      {/* save result */}
      <div className="mt-8 rounded-3xl border-2 border-brown/10 bg-white p-5">
        <h3 className="font-display text-xl font-extrabold text-brown">Save your result</h3>
        <p className="text-sm text-muted-foreground">
          Add your name to the local leaderboard and egg gallery.
        </p>
        {saved ? (
          <p className="mt-3 flex items-center gap-2 font-bold text-green-700">
            <Check className="size-5" /> Saved locally as “{username.trim()}”.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              placeholder="Your egg-scientist name"
              className="flex-1 rounded-full border-2 border-brown/15 bg-cream px-5 py-3 font-bold text-brown outline-none focus:border-yolk"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!username.trim()}
              className="rounded-full bg-yolk px-6 py-3 font-extrabold text-brown shadow-md transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => { sfx('click'); onMeasureAgain() }}
          className="inline-flex items-center gap-2 rounded-full border-2 border-brown/15 bg-white px-6 py-3 font-extrabold text-brown transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="size-5" /> Measure Again
        </button>
        <button
          type="button"
          onClick={downloadCard}
          className="inline-flex items-center gap-2 rounded-full border-2 border-brown/15 bg-white px-6 py-3 font-extrabold text-brown transition-transform hover:-translate-y-0.5"
        >
          <Camera className="size-5" /> Save Result Card
        </button>
        <button
          type="button"
          onClick={() => { sfx('click'); navigate('leaderboard') }}
          className="inline-flex items-center gap-2 rounded-full bg-orange-accent px-6 py-3 font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5"
        >
          <Trophy className="size-5" /> View Leaderboard
        </button>
      </div>
    </div>
  )
}
