'use client'

import { useState } from 'react'
import { AppProvider, useApp } from '@/components/app-context'
import { IntroAnimation } from '@/components/intro-animation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Home } from '@/components/home'
import { Analyzer } from '@/components/analyzer'
import { Leaderboard } from '@/components/leaderboard'
import { ClickerTrap } from '@/components/clicker-trap'
import { About } from '@/components/about'

function CurrentView() {
  const { view } = useApp()
  switch (view) {
    case 'analyze':
      return <Analyzer />
    case 'leaderboard':
      return <Leaderboard />
    case 'game':
      return <ClickerTrap />
    case 'about':
      return <About />
    default:
      return <Home />
  }
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <CurrentView />
      </main>
      <Footer />
    </div>
  )
}

export default function Page() {
  const [introDone, setIntroDone] = useState(false)
  return (
    <AppProvider>
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}
      <Shell />
    </AppProvider>
  )
}
