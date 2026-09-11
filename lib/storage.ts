import type { UserResult } from './types'
import { DEMO_RESULTS } from './demo-data'

const STORAGE_KEY = 'unnimutta:results:v1'
const SOUND_KEY = 'unnimutta:sound:v1'

function isStorageAvailable(): boolean {
  try {
    const t = '__unnimutta_test__'
    window.localStorage.setItem(t, '1')
    window.localStorage.removeItem(t)
    return true
  } catch {
    return false
  }
}

export function loadResults(): UserResult[] {
  if (typeof window === 'undefined' || !isStorageAvailable()) return DEMO_RESULTS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEMO_RESULTS
    const parsed = JSON.parse(raw) as UserResult[]
    if (!Array.isArray(parsed)) return DEMO_RESULTS
    // Keep demo users visible alongside real local entries.
    const userIds = new Set(parsed.map((r) => r.id))
    const demos = DEMO_RESULTS.filter((d) => !userIds.has(d.id))
    return [...parsed, ...demos]
  } catch {
    return DEMO_RESULTS
  }
}

function persistUserResults(results: UserResult[]) {
  if (typeof window === 'undefined' || !isStorageAvailable()) return
  const userOnly = results.filter((r) => !r.id.startsWith('demo-'))
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly))
  } catch {
    // Likely quota exceeded — drop images from the oldest entries and retry.
    const trimmed = userOnly.map((r, i) =>
      i < userOnly.length - 8 ? { ...r, eggImage: null } : r,
    )
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch {
      /* give up quietly; the leaderboard still works in-memory this session */
    }
  }
}

/** Insert a new result or update an existing user's entry (matched by username). */
export function saveResult(result: UserResult): UserResult[] {
  const existing = loadResults().filter((r) => !r.id.startsWith('demo-'))
  const idx = existing.findIndex(
    (r) => r.username.toLowerCase() === result.username.toLowerCase(),
  )
  if (idx >= 0) {
    existing[idx] = { ...result, id: existing[idx].id }
  } else {
    existing.push(result)
  }
  persistUserResults(existing)
  return loadResults()
}

export function loadSoundPref(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(SOUND_KEY) === 'on'
  } catch {
    return false
  }
}

export function saveSoundPref(on: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {
    /* ignore */
  }
}

/**
 * Resize + compress an image data URL so we never blow out LocalStorage.
 * Returns a JPEG data URL no wider/taller than `max` pixels.
 */
export function compressImage(dataUrl: string, max = 640, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      let { width, height } = img
      if (width > height && width > max) {
        height = Math.round((height * max) / width)
        width = max
      } else if (height > max) {
        width = Math.round((width * max) / height)
        height = max
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      try {
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch {
        resolve(dataUrl)
      }
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}
