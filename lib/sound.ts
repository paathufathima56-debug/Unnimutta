/**
 * Tiny synthesized sound system built on the Web Audio API.
 *
 * Everything is generated on the fly (oscillators + noise), so there are no
 * audio files to ship and nothing copyrighted. If the browser has no audio
 * context, or autoplay is blocked, every call is a safe no-op.
 *
 * To swap in real recorded effects later, replace the body of `play()` with an
 * <audio>/AudioBuffer lookup keyed by `SoundName` — the public API stays the same.
 */
export type SoundName =
  | 'swing'
  | 'impact'
  | 'whoosh'
  | 'splash'
  | 'confirm'
  | 'same'
  | 'different'
  | 'achievement'
  | 'dance'
  | 'click'
  | 'pop'

let ctx: AudioContext | null = null
let enabled = false

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    try {
      ctx = new AC()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setSoundEnabled(on: boolean) {
  enabled = on
  if (on) ensureCtx()
}

export function isSoundEnabled() {
  return enabled
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gain: number,
  slideTo?: number,
) {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + start)
  if (slideTo) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, slideTo),
      ac.currentTime + start + duration,
    )
  }
  g.gain.setValueAtTime(0.0001, ac.currentTime + start)
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration)
  osc.connect(g).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + duration + 0.02)
}

function noise(ac: AudioContext, start: number, duration: number, gain: number) {
  const bufferSize = Math.floor(ac.sampleRate * duration)
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const src = ac.createBufferSource()
  src.buffer = buffer
  const g = ac.createGain()
  g.gain.setValueAtTime(gain, ac.currentTime + start)
  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 800
  src.connect(filter).connect(g).connect(ac.destination)
  src.start(ac.currentTime + start)
}

export function play(name: SoundName) {
  if (!enabled) return
  const ac = ensureCtx()
  if (!ac) return
  try {
    switch (name) {
      case 'swing':
        noise(ac, 0, 0.18, 0.18)
        break
      case 'impact':
        tone(ac, 180, 0, 0.14, 'square', 0.25, 60)
        noise(ac, 0, 0.1, 0.2)
        break
      case 'whoosh':
        tone(ac, 700, 0, 0.35, 'sine', 0.12, 120)
        break
      case 'splash':
        noise(ac, 0, 0.3, 0.22)
        tone(ac, 320, 0.02, 0.3, 'sine', 0.12, 80)
        break
      case 'confirm':
        tone(ac, 520, 0, 0.08, 'triangle', 0.18)
        tone(ac, 780, 0.08, 0.12, 'triangle', 0.18)
        break
      case 'same':
        tone(ac, 392, 0, 0.16, 'triangle', 0.2)
        tone(ac, 523, 0.16, 0.16, 'triangle', 0.2)
        tone(ac, 659, 0.32, 0.16, 'triangle', 0.2)
        tone(ac, 784, 0.48, 0.4, 'triangle', 0.22)
        break
      case 'different':
        tone(ac, 440, 0, 0.18, 'sawtooth', 0.16, 180)
        tone(ac, 300, 0.18, 0.35, 'sawtooth', 0.16, 120)
        break
      case 'achievement':
        tone(ac, 659, 0, 0.1, 'square', 0.16)
        tone(ac, 784, 0.1, 0.1, 'square', 0.16)
        tone(ac, 1046, 0.2, 0.3, 'square', 0.18)
        break
      case 'dance':
        for (let i = 0; i < 6; i++) {
          tone(ac, i % 2 ? 523 : 659, i * 0.12, 0.1, 'square', 0.12)
        }
        break
      case 'click':
        tone(ac, 660, 0, 0.05, 'triangle', 0.14)
        break
      case 'pop':
        tone(ac, 880, 0, 0.06, 'sine', 0.16, 440)
        break
    }
  } catch {
    /* audio failed — stay silent, never crash */
  }
}
