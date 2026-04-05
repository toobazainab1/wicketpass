import { useState } from "react"

export default function RewardPushForm() {
  const [tier, setTier]       = useState("All Fans")
  const [sponsor, setSponsor] = useState("")
  const [reward, setReward]   = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  function airdrop() {
    if (!sponsor || !reward) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1500)
  }

  return (
    <div className="ap-card">
      <div className="ap-card-title">Push Sponsor Reward</div>
      <div className="ap-reward-form">
        <div>
          <div className="ap-field-label">Select Fan Tier</div>
          <select className="ap-select" value={tier} onChange={(e) => setTier(e.target.value)}>
            <option>All Fans</option>
            <option>Legend Only</option>
            <option>Die-Hard & Above</option>
            <option>Fan & Above</option>
          </select>
        </div>
        <div>
          <div className="ap-field-label">Sponsor Name</div>
          <input className="ap-reward-input" type="text" placeholder="e.g. Pepsi, Jazz, HBL" value={sponsor} onChange={(e) => setSponsor(e.target.value)} />
        </div>
        <div>
          <div className="ap-field-label">Reward Description</div>
          <input className="ap-reward-input" type="text" placeholder="e.g. 50 bonus tokens" value={reward} onChange={(e) => setReward(e.target.value)} />
        </div>
        <button className="ap-airdrop-btn" onClick={airdrop} disabled={loading}>
          {loading ? "Sending to WireFluid..." : "Airdrop Reward to Fans"}
        </button>
        {done && <div className="ap-success-msg">✅ Reward airdropped! All qualifying fans notified on WireFluid.</div>}
      </div>
    </div>
  )
}