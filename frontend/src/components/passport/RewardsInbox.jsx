import { useState } from "react"

const REWARDS = [
  { icon:"🎁", bg:"gold",   title:"Pepsi airdropped 50 tokens",      desc:"Sponsor reward for Legend fans • 2 days ago",        action:"Claim"  },
  { icon:"🔓", bg:"green",  title:"Priority ticket access unlocked",  desc:"24hr early access to next PSL season • Active",      action:"Active" },
  { icon:"🏆", bg:"purple", title:"VIP player meet & greet ballot",   desc:"Legend exclusive ballot entry • Ends April 20",      action:"Enter"  },
  { icon:"🎫", bg:"gold",   title:"10% ticket discount — next purchase", desc:"Loyalty discount for Die-Hard+ fans • Valid 30 days", action:"Use" },
]

export default function RewardsInbox() {
  const [claimed, setClaimed] = useState({})

  return (
    <div className="pp-rewards">
      {REWARDS.map((r, i) => (
        <div className="pp-reward-item" key={i}>
          <div className={`pp-reward-icon ${r.bg}`}>{r.icon}</div>
          <div className="pp-reward-info">
            <div className="pp-reward-title">{r.title}</div>
            <div className="pp-reward-desc">{r.desc}</div>
          </div>
          <button
            className="pp-reward-claim"
            onClick={() => setClaimed({ ...claimed, [i]: true })}
            style={claimed[i] ? { color:"#B8FF4F", borderColor:"rgba(184,255,79,0.3)" } : {}}
          >
            {claimed[i] ? "Done ✓" : r.action}
          </button>
        </div>
      ))}
    </div>
  )
}