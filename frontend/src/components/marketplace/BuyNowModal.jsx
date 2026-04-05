import { useState } from "react"

export default function BuyNowModal({ item, onClose }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function confirm() {
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true) }, 1500)
  }

  return (
    <div className="mk-modal-overlay">
      <div className="mk-modal">
        <div className="mk-modal-icon">🎟️</div>
        <div className="mk-modal-title">{item.match}</div>
        <div className="mk-modal-sub">{item.date} • {item.venue}</div>
        <div className="mk-modal-price">PKR {item.price.toLocaleString()}</div>
        <div className="mk-modal-note">
          NFT ownership transfers to your wallet on WireFluid Network.
          PSL royalty deducted automatically. Verifiable on WireScan.
        </div>
        {!success ? (
          <div className="mk-modal-btns">
            <button className="mk-modal-confirm" onClick={confirm} disabled={loading}>
              {loading ? "Processing on WireFluid..." : "Confirm Purchase"}
            </button>
            <button className="mk-modal-cancel" onClick={onClose}>Cancel</button>
          </div>
        ) : (
          <div className="mk-success show">✅ NFT transferred to your wallet! Tx on WireScan.</div>
        )}
      </div>
    </div>
  )
}