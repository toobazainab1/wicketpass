import Navbar from "../components/layout/Navbar"
import ReputationRing from "../components/passport/ReputationRing"
import TierBadge from "../components/passport/TierBadge"
import TierProgressBar from "../components/passport/TierProgressBar"
import AttendanceTimeline from "../components/passport/AttendanceTimeline"
import RewardsInbox from "../components/passport/RewardsInbox"
import TrustScore from "../components/passport/TrustScore"

const STATS = [
  { icon:"🏟️", num:"24",  label:"Matches Attended", color:"green"  },
  { icon:"⭐",  num:"847", label:"Reputation Score",  color:"gold"   },
  { icon:"✅",  num:"98%", label:"Trust Score",        color:"green"  },
  { icon:"🎁",  num:"6",   label:"Rewards Earned",    color:"purple" },
  { icon:"🎟️", num:"3",   label:"Active Tickets",    color:"cyan"   },
  { icon:"🏪",  num:"2",   label:"Clean Resales",     color:"gold"   },
]

const TIERS = [
  { icon:"⚪", name:"Rookie",   req:"0 matches",    color:"#888"    },
  { icon:"⭐", name:"Fan",      req:"3+ matches",   color:"#c0c0c0" },
  { icon:"🏅", name:"Die-Hard", req:"10+ matches",  color:"#FFB800" },
  { icon:"🏆", name:"Legend",   req:"Multi-season", color:"#FFB800", current:true },
]

export default function FanPassport() {
  return (
    <div className="pp">
      <div className="pp-glow pp-g1" />
      <div className="pp-glow pp-g2" />

      <Navbar active="passport" />

      <div className="pp-body">

        <div className="pp-top">
          <div className="pp-passport-card">
            <ReputationRing score={847} max={1000} />
            <TierBadge tier="Legend" />
            <TierProgressBar current={847} max={1000} />
            <div className="pp-wallet-addr">
              0x9A18c...924a4 • WireFluid Network
            </div>
          </div>

          <div className="pp-stats-grid">
            {STATS.map((s) => (
              <div className={`pp-stat-card ${s.color}`} key={s.label}>
                <span className="pp-stat-icon">{s.icon}</span>
                <div className="pp-stat-num">{s.num}</div>
                <div className="pp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pp-tiers-row">
          {TIERS.map((t) => (
            <div className={`pp-tier-card ${t.current ? "current" : ""}`} key={t.name}>
              <span className="pp-tier-card-icon">{t.icon}</span>
              <div className="pp-tier-card-name" style={{ color: t.color }}>{t.name}</div>
              <div className="pp-tier-card-req">{t.req}</div>
              {t.current && <div className="pp-current-tag">Your Tier</div>}
            </div>
          ))}
        </div>

        <div className="pp-bottom">
          <div className="pp-section">
            <div className="pp-section-title">📅 Attendance Timeline</div>
            <AttendanceTimeline />
          </div>
          <div className="pp-section">
            <div className="pp-section-title">🎁 Rewards Inbox</div>
            <RewardsInbox />
          </div>
        </div>

      </div>
    </div>
  )
}