export interface EggScore {
  score: number
  tier: 'high' | 'medium' | 'low'
  message: string
  breakdown: { label: string; points: number; max: number }[]
}

/**
 * A playful "egg documentation score". This is intentionally NOT a scientific
 * double-yolk detector — it only rewards how usable the uploaded image is as
 * research material (resolution, aspect ratio, size on disk).
 */
export function scoreEggImage(
  width: number,
  height: number,
  byteLength: number,
): EggScore {
  const megapixels = (width * height) / 1_000_000

  // Resolution: reward a reasonably sized photo, cap at ~2MP.
  const resolutionPoints = Math.round(Math.min(megapixels / 2, 1) * 45)

  // Aspect ratio: reward something not absurdly stretched.
  const ratio = width && height ? Math.max(width, height) / Math.min(width, height) : 99
  const aspectPoints = ratio <= 2 ? 25 : ratio <= 3 ? 15 : 6

  // File richness: some detail on disk, but nothing crazy.
  const kb = byteLength / 1024
  const richnessPoints = kb >= 40 ? 20 : kb >= 12 ? 12 : 6

  // Everyone gets a participation bonus. The egg tried.
  const participation = 10

  let score = resolutionPoints + aspectPoints + richnessPoints + participation
  score = Math.max(31, Math.min(100, score))

  let tier: EggScore['tier']
  let message: string
  if (score >= 80) {
    tier = 'high'
    message = 'Excellent egg documentation. The scientific community is trembling.'
  } else if (score >= 55) {
    tier = 'medium'
    message = 'Acceptable research material.'
  } else {
    tier = 'low'
    message = 'The egg tried its best.'
  }

  return {
    score,
    tier,
    message,
    breakdown: [
      { label: 'Resolution', points: resolutionPoints, max: 45 },
      { label: 'Framing', points: aspectPoints, max: 25 },
      { label: 'Detail on disk', points: richnessPoints, max: 20 },
      { label: 'Participation', points: participation, max: 10 },
    ],
  }
}
