import { useNavigate } from "react-router-dom"

const LINKS = [
  { label:"Portal",      path:"/portal"      },
  { label:"Passport",    path:"/passport"    },
  { label:"Marketplace", path:"/marketplace" },
  { label:"Gate",        path:"/gate"        },
  { label:"Admin",       path:"/admin"       },
]

export default function Navbar({ active }) {
  const navigate = useNavigate()

  return (
    <nav className="fp-nav">
      <div className="fp-logo" onClick={() => navigate("/")}>
        <div className="fp-logo-icon">🏏</div>
        <div className="fp-logo-txt">Wicket<span>Pass</span></div>
      </div>
      <div className="fp-navlinks">
        {LINKS.map((l) => (
          <div
            key={l.label}
            className={`fp-navlink ${active === l.label.toLowerCase() ? "active" : ""}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </div>
        ))}
      </div>
      <div className="fp-nav-right">
        <div className="fp-tier-badge">🏆 Legend</div>
        <div className="fp-wallet">0x9A18c...924a4</div>
      </div>
    </nav>
  )
}