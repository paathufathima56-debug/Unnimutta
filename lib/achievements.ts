export const PERFECT_YOLK_RATIO = 'PERFECT YOLK RATIO'

export interface Achievement {
  name: string
  description: string
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  [PERFECT_YOLK_RATIO]: {
    name: PERFECT_YOLK_RATIO,
    description: 'Two yolks. One destiny.',
  },
}

export function achievementFor(isEqual: boolean): string | null {
  return isEqual ? PERFECT_YOLK_RATIO : null
}
