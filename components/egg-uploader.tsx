'use client'

import { useCallback, useRef, useState } from 'react'
import { Camera, Upload, RefreshCw, X } from 'lucide-react'
import { useApp } from './app-context'
import { ChickMascot } from './chick-mascot'

interface EggUploaderProps {
  onImage: (dataUrl: string, width: number, height: number, bytes: number) => void
}

function estimateBytes(dataUrl: string) {
  const base = dataUrl.split(',')[1] ?? ''
  return Math.floor((base.length * 3) / 4)
}

export function EggUploader({ onImage }: EggUploaderProps) {
  const { sfx } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDataUrl = useCallback(
    (dataUrl: string) => {
      const img = new Image()
      img.onload = () => {
        setPreview(dataUrl)
        onImage(dataUrl, img.naturalWidth, img.naturalHeight, estimateBytes(dataUrl))
      }
      img.onerror = () => setError('The egg escaped. Please try another image.')
      img.src = dataUrl
    },
    [onImage],
  )

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('That does not look like an egg photo. Please choose an image file.')
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('That egg is enormous (over 25MB). Please pick a smaller photo.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => { sfx('confirm'); handleDataUrl(String(reader.result)) }
    reader.onerror = () => setError('The egg escaped. Please try another image.')
    reader.readAsDataURL(file)
  }

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }, [])

  const startCamera = async () => {
    setError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('No camera available on this device. Try uploading a photo instead.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      setCameraOn(true)
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          void videoRef.current.play()
        }
      })
    } catch {
      setError('Camera permission denied. You can still upload a photo below.')
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    sfx('confirm')
    stopCamera()
    handleDataUrl(dataUrl)
  }

  const reset = () => {
    setPreview(null)
    setError(null)
    sfx('click')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-center gap-3">
        <ChickMascot expression="happy" size={72} />
        <div className="text-left">
          <h2 className="font-display text-3xl font-extrabold text-brown">Show us your egg.</h2>
          <p className="text-sm text-muted-foreground">
            Use your camera or upload a photo of a double-yolk egg.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="animate-shake mb-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm font-bold text-destructive"
        >
          {error}
        </div>
      )}

      {/* preview */}
      {preview ? (
        <figure className="rounded-3xl border-2 border-brown/10 bg-white p-3 soft-shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview || '/placeholder.svg'}
            alt="Your uploaded egg specimen"
            className="mx-auto max-h-[52vh] w-auto rounded-2xl object-contain"
            title="Please do not eat the research material."
          />
          <figcaption className="mt-3 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border-2 border-brown/15 bg-white px-5 py-2.5 font-bold text-brown transition-transform hover:-translate-y-0.5"
            >
              <RefreshCw className="size-4" /> Replace image
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-muted-foreground hover:text-brown"
            >
              <X className="size-4" /> Remove
            </button>
          </figcaption>
        </figure>
      ) : cameraOn ? (
        <div className="rounded-3xl border-2 border-brown/10 bg-black/90 p-3">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="mx-auto max-h-[52vh] w-auto rounded-2xl"
          />
          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              onClick={capture}
              className="inline-flex items-center gap-2 rounded-full bg-yolk px-6 py-2.5 font-extrabold text-brown shadow-md transition-transform hover:-translate-y-0.5"
            >
              <Camera className="size-4" /> Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-full border-2 border-white/30 px-6 py-2.5 font-bold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={startCamera}
            className="group flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-brown/20 bg-white p-8 text-center transition-colors hover:border-yolk hover:bg-cream"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-yolk/30 text-brown transition-transform group-hover:scale-110">
              <Camera className="size-8" />
            </span>
            <span className="font-display text-xl font-extrabold text-brown">📷 Use Camera</span>
            <span className="text-sm text-muted-foreground">Capture an egg live, where supported.</span>
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-brown/20 bg-white p-8 text-center transition-colors hover:border-yolk hover:bg-cream"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-orange-accent/20 text-orange-accent transition-transform group-hover:scale-110">
              <Upload className="size-8" />
            </span>
            <span className="font-display text-xl font-extrabold text-brown">📁 Upload Photo</span>
            <span className="text-sm text-muted-foreground">JP, PNG, WEBP — common formats welcome.</span>
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onFile}
      />
    </div>
  )
}
