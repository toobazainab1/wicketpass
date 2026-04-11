import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import ConnectWallet from "../components/wallet/ConnectWallet"

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener("resize", resize)
    const colors = ["#00C170", "#B8FF4F", "#6C3FC7", "#00E5FF", "#FFB800"]
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4, dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)], alpha: Math.random() * 0.35 + 0.08,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  const pills = [
    { icon:"🎟️", label:"NFT Tickets",       cls:"g",  path:"/portal"      },
    { icon:"⭐",  label:"Fan Passport",       cls:"gd", path:"/passport"    },
    { icon:"🏪",  label:"Resale Marketplace", cls:"p",  path:"/marketplace" },
    { icon:"🚩",  label:"Gate Verification",  cls:"c",  path:"/gate"        },
  ]

  const steps = [
    { num:"01", icon:"🔒", color:"#00C170", title:"Connect Wallet",  desc:"Connect your MetaMask wallet. Your wallet is your identity — no signup needed." },
    { num:"02", icon:"🎟️", color:"#FFB800", title:"Buy NFT Ticket",  desc:"Pick your match and buy. Ticket minted as NFT on WireFluid — impossible to fake." },
    { num:"03", icon:"🏟️", color:"#6C3FC7", title:"Attend & Scan",   desc:"Show your QR at the gate. Verified instantly on-chain. Attendance logged forever." },
    { num:"04", icon:"⭐",  color:"#00E5FF", title:"Earn Rewards",    desc:"Every match builds your Fan Passport. Earn tier badges, get priority access and VIP perks." },
  ]

  const features = [
    { icon:"🎟️", title:"Zero Fake Tickets",       tag:"For Fans",      desc:"Every ticket is an NFT on WireFluid blockchain. Cryptographically impossible to duplicate. Show up and always get in." },
    { icon:"⭐",  title:"Your Loyalty, Rewarded",  tag:"For True Fans", desc:"Every match builds your on-chain Fan Passport. The more loyal you are, the more you unlock — early access, discounts, VIP ballots." },
    { icon:"🏪",  title:"Safe Resale, Always",     tag:"For Everyone",  desc:"Can't make the match? Resell safely. Smart contract caps the price. No scalpers. No black market." },
  ]

  const heroLine1 = ["The", "Future", "of"]

  return (
    <div className="lv2">
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }} />
      <div className="lv2-glow lv2-g1" />
      <div className="lv2-glow lv2-g2" />
      <div className="lv2-glow lv2-g3" />
      <div className="lv2-grid" />

      <nav className="lv2-nav">
        <div className="lv2-logo" onClick={() => navigate("/")}>
          <div className="lv2-logo-icon">🏏</div>
          <div className="lv2-logo-text">Wicket<span>Pass</span></div>
        </div>
        <ConnectWallet primary onConnected={() => navigate("/portal")} />
      </nav>

      <section className="lv2-hero">
        <div className="lv2-badge lv2-anim-badge">
          <div className="lv2-dot" />
          Live on WireFluid Network
        </div>

        <h1 className="lv2-h1">
          <span className="lv2-hero-line">
            {heroLine1.map((word, i) => (
              <span key={word} className="lv2-word-reveal" style={{ animationDelay:`${0.1 + i * 0.12}s` }}>
                {word}{i < heroLine1.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </span>
          <br />
          <span className="lv2-hero-line">
            <span className="g lv2-word-reveal" style={{ animationDelay:"0.46s" }}>PSL</span>
            <span className="lv2-word-reveal" style={{ animationDelay:"0.58s" }}>&nbsp;Starts&nbsp;</span>
            <span className="l lv2-word-reveal" style={{ animationDelay:"0.70s" }}>Here</span>
          </span>
        </h1>

        <p className="lv2-sub lv2-anim-sub">
          Verified NFT tickets. Loyal fans rewarded on-chain.<br />Zero fraud. Forever.
        </p>

        <div className="lv2-btns lv2-anim-btns">
          <ConnectWallet primary onConnected={() => navigate("/portal")} />
          <button className="lv2-btn-s" onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior:"smooth" })}>
            ▶ Watch Demo
          </button>
        </div>

        <div className="lv2-pills lv2-anim-pills">
          {pills.map((p) => (
            <div className="lv2-pill" key={p.label} onClick={() => navigate(p.path)} style={{ cursor:"pointer" }}>
              <div className={`lv2-pill-icon ${p.cls}`}>{p.icon}</div>
              {p.label}
            </div>
          ))}
        </div>
      </section>

      <div className="lv2-howit" id="how-it-works">
        <div className="lv2-section-label">How it works</div>
        <div className="lv2-section-title">Four steps. <span>Zero fraud.</span></div>
        <div className="lv2-steps">
          {steps.map((s) => (
            <div className="lv2-step" key={s.num}>
              <div className="lv2-step-num">{s.num}</div>
              <div className="lv2-step-bar" style={{ background:`linear-gradient(90deg,${s.color},transparent)` }} />
              <span className="lv2-step-icon">{s.icon}</span>
              <div className="lv2-step-title">{s.title}</div>
              <div className="lv2-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lv2-features">
        <div className="lv2-feat-grid">
          {features.map((f) => (
            <div className="lv2-feat" key={f.title}>
              <span className="lv2-feat-icon">{f.icon}</span>
              <div className="lv2-feat-title">{f.title}</div>
              <div className="lv2-feat-desc">{f.desc}</div>
              <span className="lv2-feat-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}