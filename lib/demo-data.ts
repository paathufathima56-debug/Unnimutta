import type { UserResult } from './types'

/**
 * Fictional demo leaderboard entries so the board never looks empty.
 * These are NOT real people — purely playful placeholder data.
 */
const NAMES = [
  'Ammachi.exe',
  'NjanNewton',
  'Mallu_Coder',
  'SambarStack',
  'PuttuAndPython',
  'Chaya.exe',
  'MoneRelax',
  'Kochu_Coder',
  'AdipoliAI',
  'VereLevel',
  'IthEnthaBro',
  'KappiCompiler',
  'SheriDa',
  'LabIlLost',
  'AssignmentPending',
  'AttendanceKurav',
  'CGPA_404',
  'CSE_Chicken',
]

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export const DEMO_RESULTS: UserResult[] = NAMES.map((username, i) => {
  const base = 18 + seeded(i, 1) * 8
  const equal = i % 4 === 0
  const y1 = Math.round(base * 100) / 100
  const y2 = equal
    ? Math.round((base + (seeded(i, 2) - 0.5) * 0.4) * 100) / 100
    : Math.round((base + 1 + seeded(i, 3) * 4) * 100) / 100
  const difference = Math.round(Math.abs(y1 - y2) * 100) / 100
  const isEqual = difference <= 0.5
  const eggScore = Math.round(52 + seeded(i, 4) * 47)
  const gameScore = Math.round(seeded(i, 5) * 240)
  return {
    id: `demo-${i}`,
    username,
    eggScore,
    yolk1Diameter: y1,
    yolk2Diameter: y2,
    difference,
    ratio: isEqual ? '1 : 1' : `${(Math.max(y1, y2) / Math.min(y1, y2)).toFixed(2)} : 1`,
    isEqual,
    calibrated: i % 3 === 0,
    achievement: isEqual ? 'PERFECT YOLK RATIO' : null,
    eggImage: null,
    date: new Date(Date.now() - i * 86_400_000 * 1.7).toISOString(),
    gameScore,
  }
})
