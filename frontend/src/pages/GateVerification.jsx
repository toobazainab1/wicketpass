import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"

const VALID_TICKETS = {
  "NFT-042": { fan:"Ali Hassan",    seat:"B-12", stand:"West",  match:"Karachi vs Lahore",        tier:"Legend",   trust:"98%", nft:"#042" },
  "NFT-089": { fan:"Sara Ahmed",    seat:"A-05", stand:"North", match:"Peshawar vs Quetta",        tier:"Die-Hard", trust:"94%", nft:"#089" },
  "NFT-124": { fan:"Usman Malik",   seat:"C-22", stand:"East",  match:"Islamabad vs Multan",       tier:"Fan",      trust:"87%", nft:"#124" },
  "NFT-210": { fan:"Zara Hussain",  seat:"G-11", stand:"West",  match:"Hyderabad vs Karachi",      tier:"Die-Hard", trust:"89%", nft:"#210" },
  "NFT-233": { fan:"Bilal Khan",    seat:"E-07", stand:"North", match:"Rawalpindiz vs Islamabad",  tier:"Legend",   trust:"96%", nft:"#233" },
  "NFT-251": { fan:"Hina Qureshi",  seat:"A-15", stand:"South", match:"Multan vs Hyderabad",       tier:"Fan",      trust:"85%", nft:"#251" },
  "NFT-267": { fan:"Kamran Shah",   seat:"C-09", stand:"East",  match:"Peshawar vs Lahore",        tier:"Legend",   trust:"99%", nft:"#267" },
  "NFT-301": { fan:"Nadia Farooq",  seat:"D-14", stand:"North", match:"Quetta vs Multan",          tier:"Fan",      trust:"80%", nft:"#301" },
}

const TIER_STYLE = {
  Legend:     { icon:"🏆", color:"#FFB800" },
  "Die-Hard": { icon:"🏅", color:"#FFB800" },
  Fan:        { icon:"⭐", color:"#c0c0c0" },
}

export default function GateVerification() {
  const navigate = useNavigate()
  const [input, setInput]     = useState("")
  const [result, setResult]   = useState(null)
  const [usedSet, setUsedSet] = useState(new Set())
  const [stats, setStats]     = useState({ scanned:0, valid:0, invalid:0 })

  function scan() {
    const id = input.trim().toUpperCase()
    if (!id) return
    const newStats = { ...stats, scanned: stats.scanned + 1 }
    if (usedSet.has(id)) {
      setResult({ type:"used", id })
      setStats({ ...newStats, invalid: newStats.invalid + 1 })
      return
    }
    const ticket = VALID_TICKETS[id]
    if (ticket) {
      setUsedSet(new Set([...usedSet, id]))
      setResult({ type:"valid", ticket })
      setStats({ ...newStats, valid: newStats.valid + 1 })
    } else {
      setResult({ type:"invalid", id })
      setStats({ ...newStats, invalid: newStats.invalid + 1 })
    }
  }

  function reset() { setInput(""); setResult(null) }

  return (
    <div className="gv">
      <Navbar active="gate" />

      <div className="gv-body">
        <div className="gv-title">Gate Scanner</div>
        <div className="gv-sub">Scan or enter ticket ID to verify on WireFluid Network</div>

        <div className="gv-stats">
          <div className="gv-stat">
            <div className="gv-stat-num">{stats.scanned}</div>
            <div className="gv-stat-label">Scanned Today</div>
          </div>
          <div className="gv-stat">
            <div className="gv-stat-num" style={{ color:"#00C170" }}>{stats.valid}</div>
            <div className="gv-stat-label">Valid</div>
          </div>
          <div className="gv-stat">
            <div className="gv-stat-num" style={{ color:"#FF4444" }}>{stats.invalid}</div>
            <div className="gv-stat-label">Invalid</div>
          </div>
        </div>

        <div className="gv-scanner-box">
          <div className="gv-scanner-label">Enter Ticket ID or Scan QR</div>
          <div className="gv-input-row">
            <input
              className="gv-input"
              placeholder="e.g. NFT-042 or 0x9A18c..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scan()}
            />
            <button className="gv-scan-btn" onClick={scan}>Verify</button>
          </div>
          <div className="gv-quick">
            <div className="gv-quick-label">Quick test:</div>
            <div className="gv-quick-btns">
              {["NFT-042","NFT-089","NFT-210","NFT-233"].map((id) => (
                <div key={id} className="gv-quick-btn" onClick={() => setInput(id)}>{id} ✅</div>
              ))}
              <div className="gv-quick-btn" onClick={() => setInput("NFT-999")}>NFT-999 ❌</div>
            </div>
          </div>
        </div>

        {!result && (
          <div className="gv-idle">
            <div className="gv-idle-icon">🚩</div>
            <div className="gv-idle-txt">Ready to scan — enter a ticket ID above</div>
          </div>
        )}

        {result?.type === "valid" && (() => {
          const t = result.ticket
          const tier = TIER_STYLE[t.tier] || TIER_STYLE.Fan
          return (
            <div className="gv-result gv-valid">
              <div className="gv-result-top">
                <div className="gv-result-icon">✅</div>
                <div className="gv-result-status">VALID</div>
                <div className="gv-result-sub">Attendance logged on WireFluid Network</div>
              </div>
              <div className="gv-fan-details">
                {[
                  { label:"Fan Name",    val:t.fan,                         cls:""      },
                  { label:"Match",       val:t.match,                       cls:""      },
                  { label:"Seat",        val:`${t.seat} • Stand ${t.stand}`,cls:""      },
                  { label:"NFT Ticket",  val:t.nft,                         cls:"green" },
                  { label:"Fan Tier",    val:`${tier.icon} ${t.tier}`,      color:tier.color },
                  { label:"Trust Score", val:t.trust,                       cls:"green" },
                ].map((row) => (
                  <div className="gv-detail-row" key={row.label}>
                    <div className="gv-detail-label">{row.label}</div>
                    <div className={`gv-detail-val ${row.cls||""}`} style={row.color?{color:row.color}:{}}>
                      {row.val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="gv-logged">
                <div className="gv-logged-dot" />
                <div className="gv-logged-txt">Attendance auto-logged to Fan Passport on WireFluid • Reputation +35 pts</div>
              </div>
            </div>
          )
        })()}

        {(result?.type === "invalid" || result?.type === "used") && (
          <div className="gv-result gv-invalid">
            <div className="gv-result-top">
              <div className="gv-result-icon">❌</div>
              <div className="gv-result-status">INVALID</div>
              <div className="gv-result-sub">
                {result.type === "used" ? "Ticket already used — entry denied" : "Ticket not found on WireFluid Network"}
              </div>
            </div>
            <div className="gv-fan-details">
              <div className="gv-detail-row">
                <div className="gv-detail-label">Ticket ID</div>
                <div className="gv-detail-val" style={{ color:"#FF4444" }}>{result.id}</div>
              </div>
              <div className="gv-detail-row">
                <div className="gv-detail-label">Status</div>
                <div className="gv-detail-val" style={{ color:"#FF4444" }}>
                  {result.type === "used" ? "Already scanned" : "Not found on blockchain"}
                </div>
              </div>
            </div>
          </div>
        )}

        {result && <button className="gv-reset-btn" onClick={reset}>Scan Next Ticket</button>}
      </div>
    </div>
  )
}