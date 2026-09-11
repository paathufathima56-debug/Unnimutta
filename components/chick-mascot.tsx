import type { ChickExpression } from '@/lib/types'

interface ChickMascotProps {
  expression?: ChickExpression
  size?: number
  idle?: boolean
  dancing?: boolean
  className?: string
  title?: string
}

/**
 * Unnimutta's original chick mascot. A single SVG with swappable facial
 * expressions and optional idle (blink / bounce / wing) animation.
 */
export function ChickMascot({
  expression = 'happy',
  size = 120,
  idle = true,
  dancing = false,
  className,
  title = 'Unnimutta the chick',
}: ChickMascotProps) {
  return (
    <div
      className={[
        'inline-block',
        idle && !dancing ? 'animate-idle-bounce' : '',
        dancing ? 'animate-chicken-dance' : '',
        className ?? '',
      ].join(' ')}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role="img"
        aria-label={`${title}, looking ${expression}`}
      >
        {/* feet */}
        <g stroke="#e8892b" strokeWidth="6" strokeLinecap="round">
          <path d="M82 176 l-10 14 M82 176 l0 16 M82 176 l10 14" fill="none" />
          <path d="M118 176 l-10 14 M118 176 l0 16 M118 176 l10 14" fill="none" />
        </g>

        {/* top tuft */}
        <g stroke="#f4b23e" strokeWidth="7" strokeLinecap="round">
          <path d="M100 34 l-10 -18" />
          <path d="M100 32 l0 -22" />
          <path d="M100 34 l10 -18" />
        </g>

        {/* left wing */}
        <g
          className={idle && !dancing ? 'animate-wing-flap' : ''}
          style={{ transformOrigin: '58px 108px' }}
        >
          <ellipse cx="46" cy="118" rx="20" ry="30" fill="#f4c542" />
        </g>
        {/* right wing */}
        <g
          className={idle && !dancing ? 'animate-wing-flap' : ''}
          style={{ transformOrigin: '142px 108px', animationDelay: '0.3s' }}
        >
          <ellipse cx="154" cy="118" rx="20" ry="30" fill="#f4c542" />
        </g>

        {/* body */}
        <ellipse cx="100" cy="112" rx="64" ry="66" fill="#ffd84d" />
        <ellipse cx="100" cy="126" rx="44" ry="44" fill="#ffe27a" />

        {/* scientist gear */}
        {expression === 'scientist' && (
          <>
            <rect x="60" y="150" width="80" height="26" rx="8" fill="#ffffff" opacity="0.9" />
            <path d="M60 156 h80" stroke="#e8e2cf" strokeWidth="3" />
          </>
        )}

        {/* face */}
        <Face expression={expression} />

        {/* beak */}
        <Beak expression={expression} />

        {/* cheeks */}
        <circle cx="66" cy="118" r="8" fill="#ffb0a0" opacity="0.6" />
        <circle cx="134" cy="118" r="8" fill="#ffb0a0" opacity="0.6" />
      </svg>
    </div>
  )
}

function Face({ expression }: { expression: ChickExpression }) {
  const blink = 'animate-blink'
  const eyeWhite = '#ffffff'
  const pupil = '#3a2a1a'

  // Glasses for scientist
  const glasses = expression === 'scientist'

  const Eye = ({ cx, blinkAnim = true }: { cx: number; blinkAnim?: boolean }) => (
    <g className={blinkAnim ? blink : ''} style={{ transformOrigin: `${cx}px 96px` }}>
      <ellipse cx={cx} cy="96" rx="12" ry="14" fill={eyeWhite} stroke="#e0c680" strokeWidth="1.5" />
      <circle cx={cx + 1} cy="98" r="6" fill={pupil} />
      <circle cx={cx + 3} cy="95" r="2" fill="#ffffff" />
    </g>
  )

  switch (expression) {
    case 'shocked':
      return (
        <>
          <ellipse cx="80" cy="94" rx="15" ry="18" fill={eyeWhite} stroke="#e0c680" strokeWidth="1.5" />
          <circle cx="81" cy="96" r="6" fill={pupil} />
          <ellipse cx="120" cy="94" rx="15" ry="18" fill={eyeWhite} stroke="#e0c680" strokeWidth="1.5" />
          <circle cx="121" cy="96" r="6" fill={pupil} />
        </>
      )
    case 'confused':
      return (
        <>
          <path d="M68 82 q10 -6 22 0" stroke={pupil} strokeWidth="4" fill="none" strokeLinecap="round" />
          <Eye cx={80} blinkAnim={false} />
          <Eye cx={120} blinkAnim={false} />
        </>
      )
    case 'serious':
    case 'proud':
      return (
        <>
          <path d="M66 84 l24 6" stroke={pupil} strokeWidth="4" strokeLinecap="round" />
          <path d="M134 84 l-24 6" stroke={pupil} strokeWidth="4" strokeLinecap="round" />
          <Eye cx={80} />
          <Eye cx={120} />
        </>
      )
    case 'disappointed':
      return (
        <>
          <path d="M68 100 q12 -8 24 0" stroke={pupil} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M108 100 q12 -8 24 0" stroke={pupil} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'scientist':
      return (
        <>
          <Eye cx={80} />
          <Eye cx={120} />
          {glasses && (
            <g stroke="#5a4632" strokeWidth="3" fill="none">
              <circle cx="80" cy="96" r="17" />
              <circle cx="120" cy="96" r="17" />
              <path d="M97 96 h6" />
              <path d="M63 92 l-10 -4" />
              <path d="M137 92 l10 -4" />
            </g>
          )}
        </>
      )
    default:
      // happy, dancing
      return (
        <>
          <Eye cx={80} />
          <Eye cx={120} />
        </>
      )
  }
}

function Beak({ expression }: { expression: ChickExpression }) {
  const open =
    expression === 'shocked' || expression === 'dancing' || expression === 'happy'
  if (expression === 'shocked') {
    return <ellipse cx="100" cy="126" rx="10" ry="13" fill="#f08a2c" />
  }
  if (open) {
    return (
      <path d="M88 120 h24 l-12 16 z" fill="#f08a2c" />
    )
  }
  if (expression === 'disappointed') {
    return <path d="M90 128 h20" stroke="#f08a2c" strokeWidth="6" strokeLinecap="round" />
  }
  return <path d="M90 120 h20 l-10 12 z" fill="#f08a2c" />
}
