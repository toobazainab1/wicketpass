import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import MatchCard from "../components/tickets/MatchCard"
import TicketCard from "../components/tickets/TicketCard"
import BuyTicketModal from "../components/tickets/BuyTicketModal"
import { PSL_MATCHES } from "../constants/matches"

const MY_TICKETS = [
  { id:42,  match:"Karachi vs Lahore",      date:"April 14", seat:"B-12", stand:"West",  color:"linear-gradient(90deg,#00C170,#B8FF4F)" },
  { id:89,  match:"Peshawar vs Quetta",     date:"April 15", seat:"A-05", stand:"North", color:"linear-gradient(90deg,#FFB800,#FF8C00)"  },
  { id:124, match:"Islamabad vs Multan",    date:"April 16", seat:"C-22", stand:"East",  color:"linear-gradient(90deg,#6C3FC7,#00E5FF)"  },
]

const CARD_COLORS = [
  { cls:"fp-card-kk", color:"#00C170" },
  { cls:"fp-card-pz", color:"#FFB800" },
  { cls:"fp-card-iu", color:"#6C3FC7" },
  { cls:"fp-card-lq", color:"#00E5FF" },
  { cls:"fp-card-hk", color:"#FF6B35" },
  { cls:"fp-card-rp", color:"#00BFFF" },
  { cls:"fp-card-ms", color:"#9B59B6" },
  { cls:"fp-card-qu", color:"#FF4444" },
]

export default function FanPortal() {
  const navigate = useNavigate()
  const [selectedMatch, setSelectedMatch] = useState(null)

  return (
    <div className="fp">
      <div className="fp-bg-glow fp-g1" />
      <div className="fp-bg-glow fp-g2" />

      <Navbar active="portal" />

      <div className="fp-body">
        <div className="fp-greeting">
          <h2>Good Evening, <span className="green">Legend</span> 🏏</h2>
          <div className="fp-score-row">
            <div className="fp-score-chip">
              Reputation Score &nbsp; <span className="fp-score-num">847</span> &nbsp; ⭐
            </div>
            <div className="fp-wirescan-note">
              WireFluid Network • All transactions verified on WireScan
            </div>
          </div>
        </div>

        <div className="fp-section-title">Upcoming Matches</div>
        <div className="fp-matches">
          {PSL_MATCHES.map((match, i) => (
            <MatchCard
              key={match.id}
              match={match}
              colorStyle={CARD_COLORS[i % CARD_COLORS.length]}
              onBuy={() => setSelectedMatch(match)}
            />
          ))}
        </div>

        <div className="fp-section-title">My Tickets</div>
        <div className="fp-tickets">
          {MY_TICKETS.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>

      {selectedMatch && (
        <BuyTicketModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  )
}