import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import StatsOverview from "../components/admin/StatsOverview"
import TierDistributionChart from "../components/admin/TierDistributionChart"
import TransactionFeed from "../components/admin/TransactionFeed"
import BlacklistTable from "../components/admin/BlacklistTable"
import RewardPushForm from "../components/admin/RewardPushForm"

const MATCHES = [
  "Karachi Kings vs Lahore Qalandars",
  "Peshawar Zalmi vs Quetta Gladiators",
  "Islamabad United vs Multan Sultans",
  "Hyderabad Kingsmen vs Karachi Kings",
  "Rawalpindiz vs Islamabad United",
  "Multan Sultans vs Hyderabad Kingsmen",
  "Lahore Qalandars vs Peshawar Zalmi",
  "Quetta Gladiators vs Rawalpindiz",
]

export default function AdminPanel() {
  const navigate = useNavigate()
  const [mintMatch, setMintMatch]   = useState(MATCHES[0])
  const [mintCount, setMintCount]   = useState("")
  const [mintPrice, setMintPrice]   = useState("")
  const [mintDone, setMintDone]     = useState(false)
  const [minting, setMinting]       = useState(false)

  function handleMint() {
    if (!mintCount || !mintPrice) return
    setMinting(true)
    setTimeout(() => { setMinting(false); setMintDone(true) }, 1500)
  }

  return (
    <div className="ap">
      <div className="ap-glow ap-g1" />
      <div className="ap-glow ap-g2" />

      <Navbar active="admin" />

      <div className="ap-body">
        <div className="ap-header">
          <div>
            <div className="ap-title">PSL <span>Admin</span> Dashboard</div>
            <div className="ap-subtitle">WicketPass platform management — WireFluid Network</div>
          </div>
          <div className="ap-live">
            <div className="ap-live-dot" />
            Live on WireFluid
          </div>
        </div>

        <StatsOverview />

        <div className="ap-grid">
          <TierDistributionChart />
          <TransactionFeed />
        </div>

        <div className="ap-mint-section">
          <div className="ap-card">
            <div className="ap-card-title">Mint New Match Tickets</div>
            <div className="ap-mint-grid">
              <div className="ap-mint-field">
                <div className="ap-field-label">Match</div>
                <select className="ap-select" value={mintMatch} onChange={(e) => setMintMatch(e.target.value)}>
                  {MATCHES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="ap-mint-field">
                <div className="ap-field-label">Number of Tickets</div>
                <input className="ap-reward-input" type="number" placeholder="e.g. 500" value={mintCount} onChange={(e) => setMintCount(e.target.value)} />
              </div>
              <div className="ap-mint-field">
                <div className="ap-field-label">Price (PKR)</div>
                <input className="ap-reward-input" type="number" placeholder="e.g. 1000" value={mintPrice} onChange={(e) => setMintPrice(e.target.value)} />
              </div>
            </div>
            <button className="ap-mint-btn" onClick={handleMint} disabled={minting}>
              {minting ? "Minting on WireFluid..." : "Mint Tickets on WireFluid Network"}
            </button>
            {mintDone && <div className="ap-success-msg">✅ Tickets minted! Transaction confirmed on WireScan.</div>}
          </div>
        </div>

        <div className="ap-bottom">
          <BlacklistTable />
          <RewardPushForm />
        </div>
      </div>
    </div>
  )
}