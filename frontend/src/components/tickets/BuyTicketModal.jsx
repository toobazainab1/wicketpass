import { useState } from "react"

export default function BuyTicketModal({ match, onClose }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function confirmBuy() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  return (
    <div className="fp-modal-overlay show">
      <div className="fp-modal">
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎟️</div>
        <h3>{match.team1} vs {match.team2}</h3>
        <p>{match.date} • {match.venue}</p>
        <div className="fp-modal-price">PKR {match.price.toLocaleString()}</div>
        <div className="fp-modal-note">
          NFT will be minted to your wallet on WireFluid Network.
          Transaction verifiable on WireScan.
        </div>
        {!success ? (
          <div className="fp-modal-btns">
            <button className="fp-modal-confirm" onClick={confirmBuy} disabled={loading}>
              {loading ? "Minting on WireFluid..." : "Confirm & Mint NFT"}
            </button>
            <button className="fp-modal-cancel" onClick={onClose}>Cancel</button>
          </div>
        ) : (
          <div className="fp-success show">✅ NFT Minted! Tx logged on WireScan.</div>
        )}
      </div>
    </div>
  )
}