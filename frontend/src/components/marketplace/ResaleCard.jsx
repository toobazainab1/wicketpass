const TIER_STYLES = {
  Legend:   { icon:"🏆", color:"#FFB800" },
  "Die-Hard":{ icon:"🏅", color:"#FFB800" },
  Fan:      { icon:"⭐", color:"#c0c0c0"  },
  Rookie:   { icon:"⚪", color:"#888"     },
}

export default function ResaleCard({ item, onBuy }) {
  const tier = TIER_STYLES[item.tier] || TIER_STYLES.Fan

  return (
    <div className="mk-card">
      <div className="mk-card-strip" style={{ background: item.stripColor }} />
      <div className="mk-card-body">
        <div className="mk-card-top">
          <div className="mk-match-name">{item.match}</div>
          <div className="mk-nft-badge">NFT {item.nft}</div>
        </div>
        <div className="mk-card-meta">
          <div className="mk-meta-row">📅 {item.date}</div>
          <div className="mk-meta-row">📍 {item.venue}</div>
          <div className="mk-meta-row">🎟️ Seat {item.seat} • Stand {item.stand}</div>
        </div>
        <div className="mk-seller-row">
          <div className="mk-seller-info">
            <div className="mk-seller-label">Seller</div>
            <div className="mk-seller-tier" style={{ color: tier.color }}>
              {tier.icon} {item.tier} Fan
            </div>
          </div>
          <div className="mk-trust">
            <div className="mk-trust-label">Trust</div>
            <div className="mk-trust-val">{item.trust}%</div>
          </div>
        </div>
        <div className="mk-price-row">
          <div className="mk-price">PKR {item.price.toLocaleString()}</div>
          <div className="mk-cap">
            Price cap: <span>PKR {item.cap.toLocaleString()}</span>
          </div>
        </div>
        <div className="mk-card-btns">
          <button className="mk-buy-btn" onClick={onBuy}>Buy Now</button>
          <button className="mk-scan-btn">WireScan ↗</button>
        </div>
      </div>
    </div>
  )
}