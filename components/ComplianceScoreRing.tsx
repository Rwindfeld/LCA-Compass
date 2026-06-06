type ComplianceScoreRingProps = {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

function strokeColor(score: number): string {
  if (score >= 90) return "#5A8A6B"
  if (score >= 70) return "#C9A961"
  return "#E07856"
}

/** Circular ISO compliance progress — full green ring at 100% (no dash gap). */
export function ComplianceScoreRing({
  score,
  size = 140,
  strokeWidth = 10,
  className = "",
}: ComplianceScoreRingProps) {
  const pct = Math.min(100, Math.max(0, score))
  const center = size / 2
  const r = center - strokeWidth
  const circumference = 2 * Math.PI * r
  const color = strokeColor(pct)
  const isComplete = pct >= 100

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="#B8C5B0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={isComplete ? "butt" : "round"}
        strokeDasharray={
          isComplete ? undefined : `${circumference * (pct / 100)} ${circumference}`
        }
        strokeDashoffset={0}
        transform={`rotate(-90 ${center} ${center})`}
        className="transition-all duration-700"
      />
    </svg>
  )
}
