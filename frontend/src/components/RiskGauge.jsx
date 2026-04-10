const CX = 110, CY = 115, R = 82, SW = 15

const SEGMENTS = [
  { key: 'SAFE',     color: '#15803D', from: 180, to: 144 },
  { key: 'LOW',      color: '#65A30D', from: 144, to: 108 },
  { key: 'MODERATE', color: '#D97706', from: 108, to:  72 },
  { key: 'HIGH',     color: '#DC2626', from:  72, to:  36 },
  { key: 'EXTREME',  color: '#7F1D1D', from:  36, to:   0 },
]

// Map risk level to CSS rotation (0° = needle pointing up = MODERATE)
const NEEDLE_ROT = { SAFE: -72, LOW: -36, MODERATE: 0, HIGH: 36, EXTREME: 72 }

const RISK_COLOR = {
  SAFE: '#15803D', LOW: '#65A30D', MODERATE: '#D97706', HIGH: '#DC2626', EXTREME: '#7F1D1D',
}

const RISK_LABEL = {
  SAFE: 'Safe',
  LOW: 'Low Risk',
  MODERATE: 'Moderate',
  HIGH: 'High Risk',
  EXTREME: 'Extreme',
}

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

function arcPath(cx, cy, r, a1, a2) {
  const s = polar(cx, cy, r, a1)
  const e = polar(cx, cy, r, a2)
  const large = Math.abs(a1 - a2) >= 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export default function RiskGauge({ riskLevel, feelsLike, zone }) {
  const rotation = NEEDLE_ROT[riskLevel] ?? 0
  const color = RISK_COLOR[riskLevel] ?? '#78716C'

  // Needle rotates around (CX, CY) using translate trick for cross-browser SVG support
  const needleTransform = `translate(${CX}px,${CY}px) rotate(${rotation}deg) translate(-${CX}px,-${CY}px)`

  return (
    <div className="gauge-wrapper">
      <svg viewBox="0 0 220 132" className="gauge-svg" aria-label={`Risk gauge showing ${riskLevel}`}>
        {/* Tick marks at segment boundaries */}
        {[180, 144, 108, 72, 36, 0].map(deg => {
          const inner = polar(CX, CY, R + 3, deg)
          const outer = polar(CX, CY, R + SW / 2 + 6, deg)
          return (
            <line
              key={deg}
              x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
              x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
              stroke="#C4BAA8" strokeWidth="1.5"
            />
          )
        })}

        {/* Background track */}
        <path
          d={arcPath(CX, CY, R, 180, 0)}
          fill="none" stroke="#EDE8DF" strokeWidth={SW} strokeLinecap="round"
        />

        {/* Colored segments — inactive ones are muted */}
        {SEGMENTS.map(seg => (
          <path
            key={seg.key}
            d={arcPath(CX, CY, R, seg.from, seg.to)}
            fill="none"
            stroke={seg.color}
            strokeWidth={SW}
            opacity={seg.key === riskLevel ? 1 : 0.2}
          />
        ))}

        {/* Needle group — rotates around (CX, CY) */}
        <g style={{
          transform: needleTransform,
          transition: 'transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Needle shaft */}
          <line
            x1={CX} y1={CY}
            x2={CX} y2={CY - 68}
            stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round"
          />
          {/* Needle tip dot */}
          <circle cx={CX} cy={CY - 68} r="3" fill={color} />
        </g>

        {/* Pivot circle */}
        <circle cx={CX} cy={CY} r="6" fill="#1C1917" />
        <circle cx={CX} cy={CY} r="3.5" fill="white" />

        {/* Zone labels */}
        <text x="18"  y="128" className="gauge-tick-label">SAFE</text>
        <text x={CX}  y="30"  className="gauge-tick-label" textAnchor="middle">MOD</text>
        <text x="202" y="128" className="gauge-tick-label" textAnchor="end">EXTREME</text>
      </svg>

      {/* Reading below gauge */}
      <div className="gauge-reading">
        <div className="gauge-risk-level" style={{ color }}>
          {RISK_LABEL[riskLevel]}
        </div>
        <div className="gauge-feels-like">
          Feels like <strong>{feelsLike}°C</strong> · {zone}
        </div>
      </div>
    </div>
  )
}
