'use client'

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import type { Circle } from '@/lib/types'

interface DraggableCircleProps {
  circle: Circle
  onChange: (c: Circle) => void
  getRect: () => DOMRect | null
  variant: 'coin' | 'yolk'
  label?: string
  interactive?: boolean
  locked?: boolean
  zIndex?: number
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function DraggableCircle({
  circle,
  onChange,
  getRect,
  variant,
  label,
  interactive = true,
  locked = false,
  zIndex = 10,
}: DraggableCircleProps) {
  const dragState = useRef<{ mode: 'move' | 'resize'; rect: DOMRect } | null>(null)
  const circleRef = useRef(circle)
  circleRef.current = circle

  const onPointerDownMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!interactive) return
      const rect = getRect()
      if (!rect) return
      e.preventDefault()
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      dragState.current = { mode: 'move', rect }
    },
    [getRect, interactive],
  )

  const onPointerDownResize = useCallback(
    (e: ReactPointerEvent) => {
      if (!interactive) return
      const rect = getRect()
      if (!rect) return
      e.preventDefault()
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      dragState.current = { mode: 'resize', rect }
    },
    [getRect, interactive],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const state = dragState.current
      if (!state) return
      e.preventDefault()
      const { rect } = state
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const c = circleRef.current
      if (state.mode === 'move') {
        onChange({ ...c, x: clamp(px, 0, 1), y: clamp(py, 0, 1) })
      } else {
        // radius = distance from center to pointer, normalized to width
        const dx = (px - c.x) * rect.width
        const dy = (py - c.y) * rect.height
        const dist = Math.sqrt(dx * dx + dy * dy)
        onChange({ ...c, r: clamp(dist / rect.width, 0.02, 0.5) })
      }
    },
    [onChange],
  )

  const endDrag = useCallback((e: ReactPointerEvent) => {
    if (dragState.current) {
      dragState.current = null
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }
  }, [])

  const isCoin = variant === 'coin'

  return (
    <div
      className="absolute select-none"
      style={{
        left: `${circle.x * 100}%`,
        top: `${circle.y * 100}%`,
        width: `${circle.r * 200}%`,
        aspectRatio: '1 / 1',
        transform: 'translate(-50%, -50%)',
        zIndex,
        touchAction: 'none',
        cursor: interactive ? 'grab' : 'default',
      }}
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: isCoin ? '3px dashed #b5721f' : '4px solid #ff5d3b',
          background: isCoin
            ? 'radial-gradient(circle at 35% 30%, rgba(255,214,64,0.45), rgba(245,158,27,0.35))'
            : 'rgba(255,93,59,0.12)',
          boxShadow: locked ? '0 0 0 3px rgba(72,187,120,0.6)' : 'none',
        }}
      >
        {isCoin && (
          <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-extrabold text-[#8a5514]">
            ₹10
          </span>
        )}
        {/* center crosshair */}
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current opacity-40" />
        <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current opacity-40" />
      </div>

      {/* label */}
      {label && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-extrabold text-white shadow"
          style={{ background: isCoin ? '#b5721f' : '#ff5d3b' }}
        >
          {label}
        </span>
      )}

      {/* resize handle */}
      {interactive && (
        <span
          role="slider"
          aria-label={`Resize ${label ?? variant}`}
          aria-valuenow={Math.round(circle.r * 1000)}
          aria-valuemin={20}
          aria-valuemax={500}
          tabIndex={0}
          onPointerDown={onPointerDownResize}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(e) => {
            const step = 0.005
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault()
              onChange({ ...circle, r: clamp(circle.r + step, 0.02, 0.5) })
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault()
              onChange({ ...circle, r: clamp(circle.r - step, 0.02, 0.5) })
            }
          }}
          className="absolute right-0 top-1/2 size-5 -translate-y-1/2 translate-x-1/2 cursor-ew-resize rounded-full border-2 border-white bg-brown shadow-md"
          style={{ touchAction: 'none' }}
        />
      )}
    </div>
  )
}
