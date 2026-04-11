import { useState } from "react"

const MY_TICKETS = [
  "NFT #042 — Karachi vs Lahore (Seat B-12)",
  "NFT #089 — Peshawar vs Quetta (Seat A-05)",
  "NFT #124 — Islamabad vs Multan (Seat C-22)",
]

export default function ListTicketModal({ onClose }) {
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const CAP = 600
  const overCap = parseInt(price) > CAP

  function submit() {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1500)
  }

  return (
    <div className="mk-modal-overlay">
      <div className="mk-modal" style={{ maxWidth:"400px", textAlign:"left" }}>
        <div className="mk-modal-title" style={{ marginBottom:"4px" }}>List Your Ticket</div>
        <div className="mk-modal-sub" style={{ marginBottom:"20px" }}>
          Set your price. Smart contract enforces the cap automatically.
        </div>

        <div className="mk-field">
          <label className="mk-field-label">Select Ticket</label>
          <select className="mk-field-input">
            {MY_TICKETS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="mk-field">
          <label className="mk-field-label">Your Price (PKR)</label>
          <input
            className="mk-field-input"
            type="number"
            placeholder="e.g. 450"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {overCap && (
          <div className="mk-cap-warning">
            ⚠️ Price exceeds the smart contract cap. Maximum: PKR {CAP.toLocaleString()}. Will be auto-capped.
          </div>
        )}

        <div className="mk-field">
          <label className="mk-field-label">Price Cap (set by PSL)</label>
          <input
            className="mk-field-input"
            type="text"
            value="PKR 600 — enforced by smart contract"
            readOnly
            style={{ opacity:0.5, cursor:"not-allowed" }}
          />
        </div>

        {!done ? (
          <>
            <button className="mk-list-submit" onClick={submit} disabled={loading}>
              {loading ? "Listing on WireFluid..." : "List on WireFluid Network"}
            </button>
            <button className="mk-list-cancel" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <div className="mk-success show">✅ Listed! Transaction confirmed on WireScan.</div>
        )}
      </div>
    </div>
  )
}