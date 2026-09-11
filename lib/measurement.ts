import type { Circle } from './types'

/** Standard physical diameter of a ₹10 Indian coin, in millimeters. */
export const REFERENCE_COIN_MM = 27

/**
 * Tolerance (in mm) under which two yolk diameters are treated as "the same".
 * Prevents tiny rounding / hand-placement noise from producing silly results.
 */
export const EQUALITY_TOLERANCE_MM = 0.5

export interface ComparisonOutput {
  yolk1: number
  yolk2: number
  difference: number
  ratio: string
  isEqual: boolean
}

/**
 * Convert a measured circle to a real-world diameter estimate.
 *
 *   real diameter = yolk pixel diameter ÷ coin pixel diameter × 27 mm
 *
 * All circles share the same displayed-image coordinate system, so their
 * normalized radii are directly comparable — the image's own pixel dimensions
 * cancel out of the ratio.
 */
export function circleToDiameterMm(yolk: Circle, coin: Circle): number {
  if (coin.r <= 0) return 0
  const diameter = (yolk.r / coin.r) * REFERENCE_COIN_MM
  return Math.round(diameter * 100) / 100
}

function simplifyRatio(a: number, b: number): string {
  if (a <= 0 || b <= 0) return '1 : 1'
  const bigger = Math.max(a, b)
  const smaller = Math.min(a, b)
  const normalized = (bigger / smaller).toFixed(2)
  // Present as "1 : N" from the smaller yolk's perspective.
  return a >= b ? `${normalized} : 1` : `1 : ${normalized}`
}

export function compareYolks(d1: number, d2: number): ComparisonOutput {
  const difference = Math.round(Math.abs(d1 - d2) * 100) / 100
  const isEqual = difference <= EQUALITY_TOLERANCE_MM
  return {
    yolk1: d1,
    yolk2: d2,
    difference,
    ratio: isEqual ? '1 : 1' : simplifyRatio(d1, d2),
    isEqual,
  }
}

export function formatMm(value: number): string {
  return `${value.toFixed(2)} mm`
}
