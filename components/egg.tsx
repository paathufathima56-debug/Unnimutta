interface EggProps {
  size?: number
  double?: boolean
  className?: string
  title?: string
}

/** A cute cracked-open egg showing yolk(s). Decorative by default. */
export function Egg({ size = 120, double = true, className, title }: EggProps) {
  return (
    <svg
      viewBox="0 0 200 170"
      width={size}
      height={(size * 170) / 200}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* egg white */}
      <path
        d="M100 8
           C150 8 176 46 182 88
           C188 128 150 162 100 162
           C50 162 12 128 18 88
           C24 46 50 8 100 8 Z"
        fill="#fffdf5"
        stroke="#f0e6c8"
        strokeWidth="3"
      />
      <path
        d="M40 120 q20 22 60 22 q40 0 60 -22 q-10 26 -60 26 q-50 0 -60 -26 Z"
        fill="#fff7df"
      />
      {double ? (
        <>
          <circle cx="74" cy="84" r="30" fill="#ffb92e" />
          <circle cx="74" cy="84" r="30" fill="url(#yolkShine)" />
          <circle cx="126" cy="90" r="30" fill="#ffb92e" />
          <circle cx="126" cy="90" r="30" fill="url(#yolkShine)" />
        </>
      ) : (
        <>
          <circle cx="100" cy="86" r="34" fill="#ffb92e" />
          <circle cx="100" cy="86" r="34" fill="url(#yolkShine)" />
        </>
      )}
      <defs>
        <radialGradient id="yolkShine" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffe28a" />
          <stop offset="55%" stopColor="#ffb92e" />
          <stop offset="100%" stopColor="#f59e1b" />
        </radialGradient>
      </defs>
    </svg>
  )
}
