'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { UserResult } from '@/lib/types'
import { loadResults, saveResult as persist, loadSoundPref, saveSoundPref } from '@/lib/storage'
import { play, setSoundEnabled, type SoundName } from '@/lib/sound'

export type AppView = 'home' | 'analyze' | 'leaderboard' | 'game' | 'about'

interface AppState {
  view: AppView
  navigate: (view: AppView) => void
  soundEnabled: boolean
  toggleSound: () => void
  sfx: (name: SoundName) => void
  results: UserResult[]
  saveResult: (r: UserResult) => void
  danceUnlocked: boolean
  unlockDance: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>('home')
  const [soundEnabled, setSound] = useState(false)
  const [results, setResults] = useState<UserResult[]>([])
  const [danceUnlocked, setDanceUnlocked] = useState(false)

  useEffect(() => {
    setResults(loadResults())
    const pref = loadSoundPref()
    setSound(pref)
    setSoundEnabled(pref)
  }, [])

  const navigate = useCallback((next: AppView) => {
    setView(next)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const toggleSound = useCallback(() => {
    setSound((prev) => {
      const next = !prev
      setSoundEnabled(next)
      saveSoundPref(next)
      if (next) play('pop')
      return next
    })
  }, [])

  const sfx = useCallback((name: SoundName) => play(name), [])

  const saveResult = useCallback((r: UserResult) => {
    setResults(persist(r))
  }, [])

  const unlockDance = useCallback(() => setDanceUnlocked(true), [])

  const value = useMemo(
    () => ({
      view,
      navigate,
      soundEnabled,
      toggleSound,
      sfx,
      results,
      saveResult,
      danceUnlocked,
      unlockDance,
    }),
    [view, navigate, soundEnabled, toggleSound, sfx, results, saveResult, danceUnlocked, unlockDance],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
