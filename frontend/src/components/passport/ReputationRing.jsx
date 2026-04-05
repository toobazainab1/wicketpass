import { useEffect, useRef } from "react"

export default function ReputationRing({ score, max }) {
  const pct = score / max
  const circumference = 2 * Math.PI * 70
  const targetOffset = circumference * (1 - pct)
  const circleRef = useRef(null)

  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
    // Start from full offset (empty ring), then animate to target
    circle.style.transition = "none"
    circle.style.strokeDashoffset = circumference
    // Force reflow so browser registers the start state
    void circle.getBoundingClientRect()
    // Now animate to the real value
    circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)"
    circle.style.strokeDashoffset = targetOffset
  }, [circumference, targetOffset])

  return (
    <div className="pp-ring-wrap">
      <svg className="pp-ring-svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#B8FF4F" />
          </linearGradient>
        </defs>
        <circle className="pp-ring-bg" cx="80" cy="80" r="70" />
        <circle
          ref={circleRef}
          className="pp-ring-fill"
          cx="80" cy="80" r="70"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            stroke: "url(#ringGrad)"
          }}
        />
      </svg>
      <div className="pp-ring-center">
        <div className="pp-ring-num">{score}</div>
        <div className="pp-ring-label">Score</div>
      </div>
    </div>
  )
}