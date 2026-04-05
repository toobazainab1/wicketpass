const TIERS = [
  { label:"⚪ Rookie",    pct:45, color:"#888"                                    },
  { label:"⭐ Fan",       pct:30, color:"#c0c0c0"                                 },
  { label:"🏅 Die-Hard",  pct:18, color:"#FFB800"                                 },
  { label:"🏆 Legend",    pct:7,  color:"linear-gradient(90deg,#FFB800,#B8FF4F)"  },
]

export default function TierDistributionChart() {
  return (
    <div className="ap-card">
      <div className="ap-card-title">Fan Tier Distribution</div>
      <div className="ap-tier-bars">
        {TIERS.map((t) => (
          <div className="ap-tier-row" key={t.label}>
            <div className="ap-tier-label">{t.label}</div>
            <div className="ap-tier-bar-wrap">
              <div
                className="ap-tier-bar-fill"
                style={{ width:`${t.pct}%`, background: t.color }}
              />
            </div>
            <div className="ap-tier-pct">{t.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}