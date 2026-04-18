export function LogoMark({ size = 14 }: { size?: number }) {
  const inset = 3
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer square — orange stroke */}
      <rect
        x="0.75"
        y="0.75"
        width="12.5"
        height="12.5"
        rx="1.5"
        stroke="#FF781D"
        strokeWidth="1.5"
      />
      {/* Inner square — faint orange fill */}
      <rect
        x={inset}
        y={inset}
        width={14 - inset * 2}
        height={14 - inset * 2}
        rx="0.75"
        fill="rgb(255 120 29 / 0.25)"
      />
    </svg>
  )
}
