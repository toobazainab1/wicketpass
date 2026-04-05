export default function MatchCard({ match, colorStyle, onBuy }) {
  return (
    <div className={`fp-match-card ${colorStyle.cls}`}>
      <div className="fp-match-num">
        Match {match.id + 13} • {match.date}
      </div>
      <div className="fp-teams">
        <div className="fp-team-name">{match.team1}</div>
        <div className="fp-vs">VS</div>
        <div className="fp-team-name">{match.team2}</div>
      </div>
      <div className="fp-match-meta">
        <div className="fp-meta-row">📅 {match.date}</div>
        <div className="fp-meta-row">📍 {match.venue}</div>
        <div className="fp-meta-row">🎟️ {match.seats} seats available</div>
      </div>
      <div className="fp-match-price">PKR {match.price.toLocaleString()}</div>
      <button className="fp-buy-btn" onClick={onBuy}>Buy Ticket</button>
    </div>
  )
}