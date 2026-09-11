'use client'

import { useCallback, useState } from 'react'
import { scoreEggImage, type EggScore as EggScoreType } from '@/lib/scoring'
import { compressImage } from '@/lib/storage'
import type { ComparisonOutput } from '@/lib/measurement'
import { EggUploader } from './egg-uploader'
import { EggScore } from './egg-score'
import { MeasurementTool } from './measurement-tool'
import { ComparisonResult } from './comparison-result'
import { ChickMascot } from './chick-mascot'
import { useApp } from './app-context'

type Stage = 'upload' | 'score' | 'measure' | 'result'

const LOADING_MESSAGES = [
  'Inspecting egg…',
  'Consulting the chicken…',
  'Performing extremely important calculations…',
  'Almost done. The yolks are being compared.',
]

function Loading() {
  const [msg] = useState(() => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <ChickMascot expression="scientist" size={120} />
      <p className="animate-fade-up font-display text-xl font-extrabold text-brown">{msg}</p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-3 animate-idle-bounce rounded-full bg-yolk"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export function Analyzer() {
  const { unlockDance } = useApp()
  const [stage, setStage] = useState<Stage>('upload')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string>('')
  const [score, setScore] = useState<EggScoreType | null>(null)
  const [comparison, setComparison] = useState<ComparisonOutput | null>(null)
  const [calibrated, setCalibrated] = useState(false)
  const [measureKey, setMeasureKey] = useState(0)

  const handleImage = useCallback(
    (dataUrl: string, width: number, height: number, bytes: number) => {
      setImage(dataUrl)
      setScore(scoreEggImage(width, height, bytes))
      setStage('score')
    },
    [],
  )

  const goMeasure = useCallback(async () => {
    setLoading(true)
    const compact = await compressImage(image, 960, 0.82)
    setImage(compact)
    // brief, purposeful loading beat
    window.setTimeout(() => {
      setLoading(false)
      setStage('measure')
      unlockDance()
    }, 1200)
  }, [image, unlockDance])

  const handleComplete = useCallback((result: ComparisonOutput, cal: boolean) => {
    setComparison(result)
    setCalibrated(cal)
    setStage('result')
  }, [])

  const measureAgain = useCallback(() => {
    setComparison(null)
    setMeasureKey((k) => k + 1)
    setStage('measure')
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {loading ? (
        <Loading />
      ) : stage === 'upload' ? (
        <EggUploader onImage={handleImage} />
      ) : stage === 'score' && score ? (
        <EggScore image={image} score={score} onContinue={goMeasure} />
      ) : stage === 'measure' ? (
        <MeasurementTool key={measureKey} image={image} onComplete={handleComplete} />
      ) : stage === 'result' && comparison ? (
        <ComparisonResult
          image={image}
          eggScore={score?.score ?? 0}
          comparison={comparison}
          calibrated={calibrated}
          onMeasureAgain={measureAgain}
        />
      ) : null}
    </section>
  )
}
