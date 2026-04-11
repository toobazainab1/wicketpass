export default function TierProgressBar({ current, max }) {
  const pct = Math.round((current / max) * 100)
  return (
    <div className="pp-progress-wrap">
      <div className="pp-progress-label">
        <span>Progress to Max</span>
        <span style={{ color:"#FFB800" }}>{current} / {max}</span>
      </div>
      <div className="pp-progress-bar">
        <div className="pp-progress-fill" style={{ width:`${pct}%` }} />
      </div>
    </div>
  )
}