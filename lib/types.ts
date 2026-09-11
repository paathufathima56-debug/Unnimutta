export type ChickExpression =
  | 'happy'
  | 'serious'
  | 'confused'
  | 'shocked'
  | 'proud'
  | 'disappointed'
  | 'scientist'
  | 'dancing'

export interface Circle {
  /** normalized center X within the image (0..1) */
  x: number
  /** normalized center Y within the image (0..1) */
  y: number
  /** normalized radius relative to image width (0..1) */
  r: number
}

export interface UserResult {
  id: string
  username: string
  eggScore: number
  yolk1Diameter: number
  yolk2Diameter: number
  difference: number
  ratio: string
  isEqual: boolean
  calibrated: boolean
  achievement: string | null
  eggImage: string | null
  date: string
  gameScore: number
}
