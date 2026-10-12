import './Chart.css'

export interface ChartPoint {
  x: number
  y: number
  label?: string
}

interface ChartProps {
  points: ChartPoint[]
  current?: ChartPoint
  xLabel: string
  yLabel: string
  title: string
  xDomain?: [number, number]
  yDomain?: [number, number]
}

function domainOf(values: number[], fallback: [number, number]): [number, number] {
  if (!values.length) return fallback
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return [min - 0.5, max + 0.5]
  const pad = (max - min) * 0.08
  return [min - pad, max + pad]
}

export function Chart({
  points,
  current,
  xLabel,
  yLabel,
  title,
  xDomain,
  yDomain,
}: ChartProps) {
  const width = 360
  const height = 200
  const pad = { top: 16, right: 16, bottom: 36, left: 44 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  if (current) {
    xs.push(current.x)
    ys.push(current.y)
  }

  const [xMin, xMax] = xDomain ?? domainOf(xs, [0, 1])
  const [yMin, yMax] = yDomain ?? domainOf(ys, [0, 1])

  const sx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin || 1)) * innerW
  const sy = (y: number) => pad.top + innerH - ((y - yMin) / (yMax - yMin || 1)) * innerH

  const path =
    points.length > 1
      ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`).join(' ')
      : ''

  return (
    <figure className="cq-chart">
      <figcaption className="cq-chart__title">{title}</figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${title}. ${yLabel} versus ${xLabel}.`}
      >
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerH}
          className="cq-chart__axis"
        />
        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={pad.left + innerW}
          y2={pad.top + innerH}
          className="cq-chart__axis"
        />
        {path && <path d={path} className="cq-chart__line" fill="none" />}
        {current && (
          <circle
            cx={sx(current.x)}
            cy={sy(current.y)}
            r={5}
            className="cq-chart__dot"
          />
        )}
        <text x={pad.left + innerW / 2} y={height - 8} textAnchor="middle" className="cq-chart__label">
          {xLabel}
        </text>
        <text
          x={14}
          y={pad.top + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${pad.top + innerH / 2})`}
          className="cq-chart__label"
        >
          {yLabel}
        </text>
      </svg>
    </figure>
  )
}
