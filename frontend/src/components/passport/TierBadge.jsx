const TIERS = {
  Rookie:   { icon:"⚪", color:"#888"    },
  Fan:      { icon:"⭐", color:"#c0c0c0" },
  "Die-Hard":{ icon:"🏅", color:"#FFB800" },
  Legend:   { icon:"🏆", color:"#FFB800" },
}

export default function TierBadge({ tier }) {
  const t = TIERS[tier] || TIERS.Rookie
  return (
    <div>
      <div className="pp-tier-icon">{t.icon}</div>
      <div className="pp-tier-name" style={{ color: t.color }}>{tier} Tier</div>
    </div>
  )
}