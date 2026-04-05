import { useState } from "react"
import Navbar from "../components/layout/Navbar"
import ResaleCard from "../components/marketplace/ResaleCard"
import ListTicketModal from "../components/marketplace/ListTicketModal"
import BuyNowModal from "../components/marketplace/BuyNowModal"

const LISTINGS = [
  { id:1,  nft:"#042", match:"Karachi vs Lahore",          date:"April 14, 2026", venue:"National Stadium, Karachi",   seat:"B-12", stand:"West",  team:"kk", price:450,  cap:600,  tier:"Legend",    trust:98,  stripColor:"linear-gradient(90deg,#00C170,#B8FF4F)"  },
  { id:2,  nft:"#089", match:"Peshawar vs Quetta",         date:"April 15, 2026", venue:"Gaddafi Stadium, Lahore",     seat:"A-05", stand:"North", team:"pz", price:700,  cap:1000, tier:"Die-Hard",   trust:94,  stripColor:"linear-gradient(90deg,#FFB800,#FF8C00)"  },
  { id:3,  nft:"#124", match:"Islamabad vs Multan",        date:"April 16, 2026", venue:"Rawalpindi Stadium",          seat:"C-22", stand:"East",  team:"iu", price:900,  cap:1200, tier:"Fan",        trust:87,  stripColor:"linear-gradient(90deg,#6C3FC7,#00E5FF)"  },
  { id:4,  nft:"#055", match:"Karachi vs Lahore",          date:"April 14, 2026", venue:"National Stadium, Karachi",   seat:"D-08", stand:"South", team:"kk", price:380,  cap:600,  tier:"Legend",    trust:100, stripColor:"linear-gradient(90deg,#00C170,#B8FF4F)"  },
  { id:5,  nft:"#201", match:"Lahore vs Peshawar",         date:"April 17, 2026", venue:"Gaddafi Stadium, Lahore",     seat:"F-14", stand:"VIP",   team:"lq", price:520,  cap:750,  tier:"Die-Hard",   trust:91,  stripColor:"linear-gradient(90deg,#00E5FF,#6C3FC7)"  },
  { id:6,  nft:"#178", match:"Quetta vs Rawalpindiz",      date:"April 21, 2026", venue:"National Stadium, Karachi",   seat:"B-33", stand:"East",  team:"qu", price:650,  cap:900,  tier:"Fan",        trust:82,  stripColor:"linear-gradient(90deg,#FF4444,#FFB800)"  },
  { id:7,  nft:"#210", match:"Hyderabad vs Karachi",       date:"April 18, 2026", venue:"National Stadium, Karachi",   seat:"G-11", stand:"West",  team:"hk", price:500,  cap:700,  tier:"Die-Hard",   trust:89,  stripColor:"linear-gradient(90deg,#FF6B35,#FFB800)"  },
  { id:8,  nft:"#233", match:"Rawalpindiz vs Islamabad",   date:"April 19, 2026", venue:"Rawalpindi Cricket Stadium",  seat:"E-07", stand:"North", team:"rp", price:600,  cap:850,  tier:"Legend",    trust:96,  stripColor:"linear-gradient(90deg,#00BFFF,#6C3FC7)"  },
  { id:9,  nft:"#251", match:"Multan vs Hyderabad",        date:"April 20, 2026", venue:"Multan Cricket Stadium",      seat:"A-15", stand:"South", team:"ms", price:580,  cap:800,  tier:"Fan",        trust:85,  stripColor:"linear-gradient(90deg,#9B59B6,#FFB800)"  },
  { id:10, nft:"#267", match:"Peshawar vs Lahore",         date:"April 22, 2026", venue:"Gaddafi Stadium, Lahore",     seat:"C-09", stand:"East",  team:"pz", price:480,  cap:700,  tier:"Legend",    trust:99,  stripColor:"linear-gradient(90deg,#FFB800,#FF8C00)"  },
  { id:11, nft:"#289", match:"Islamabad vs Karachi",       date:"April 23, 2026", venue:"Rawalpindi Cricket Stadium",  seat:"B-20", stand:"West",  team:"iu", price:750,  cap:1000, tier:"Die-Hard",   trust:92,  stripColor:"linear-gradient(90deg,#6C3FC7,#00E5FF)"  },
  { id:12, nft:"#301", match:"Quetta vs Multan",           date:"April 24, 2026", venue:"National Stadium, Karachi",   seat:"D-14", stand:"North", team:"qu", price:420,  cap:600,  tier:"Fan",        trust:80,  stripColor:"linear-gradient(90deg,#FF4444,#FFB800)"  },
]

const FILTERS = [
  { label:"All Matches",         val:"all" },
  { label:"Karachi Kings",       val:"kk"  },
  { label:"Lahore Qalandars",    val:"lq"  },
  { label:"Peshawar Zalmi",      val:"pz"  },
  { label:"Quetta Gladiators",   val:"qu"  },
  { label:"Islamabad United",    val:"iu"  },
  { label:"Multan Sultans",      val:"ms"  },
  { label:"Hyderabad Kingsmen",  val:"hk"  },
  { label:"Rawalpindiz",         val:"rp"  },
]

export default function Marketplace() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price-asc")
  const [buyItem, setBuyItem] = useState(null)
  const [listOpen, setListOpen] = useState(false)

  const filtered = LISTINGS
    .filter(l => activeFilter === "all" || l.team === activeFilter)
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "trust")      return b.trust - a.trust
      return 0
    })

  return (
    <div className="mk">
      <div className="mk-glow mk-g1" />
      <div className="mk-glow mk-g2" />

      <Navbar active="marketplace" />

      <div className="mk-body">
        <div className="mk-header">
          <div className="mk-title-wrap">
            <div className="mk-title">Resale Marketplace</div>
            <div className="mk-subtitle">
              All prices capped by smart contract &bull; <span>PSL earns royalty on every sale</span>
            </div>
          </div>
          <button className="mk-list-btn" onClick={() => setListOpen(true)}>
            + List My Ticket
          </button>
        </div>

        <div className="mk-filters">
          {FILTERS.map((f) => (
            <div
              key={f.val}
              className={`mk-filter ${activeFilter === f.val ? "active" : ""}`}
              onClick={() => setActiveFilter(f.val)}
            >
              {f.label}
            </div>
          ))}
          <div className="mk-sort">
            Sort:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="trust">Seller Trust</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mk-empty-state">
            <div className="mk-empty-icon">🎟️</div>
            <div className="mk-empty-txt">No listings for this team right now</div>
          </div>
        ) : (
          <div className="mk-grid">
            {filtered.map((item) => (
              <ResaleCard key={item.id} item={item} onBuy={() => setBuyItem(item)} />
            ))}
          </div>
        )}
      </div>

      {buyItem && (
        <BuyNowModal item={buyItem} onClose={() => setBuyItem(null)} />
      )}

      {listOpen && (
        <ListTicketModal onClose={() => setListOpen(false)} />
      )}
    </div>
  )
}