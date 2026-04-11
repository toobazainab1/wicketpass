const FEED = [
  { dot:"green",  txt:"Ticket minted — Karachi vs Lahore",          time:"2 seconds ago",   hash:"0x1a2b...3c4d" },
  { dot:"gold",   txt:"Resale completed — NFT #089 • PKR 700",      time:"18 seconds ago",  hash:"0x5e6f...7g8h" },
  { dot:"purple", txt:"Fan tier upgraded — 0x9A18c → Legend",       time:"45 seconds ago",  hash:"0x9i0j...1k2l" },
  { dot:"green",  txt:"Gate scan verified — NFT #042",              time:"1 minute ago",    hash:"0x3m4n...5o6p" },
  { dot:"gold",   txt:"Royalty paid to PSL — PKR 70",              time:"2 minutes ago",   hash:"0x7q8r...9s0t" },
  { dot:"green",  txt:"Ticket minted — Peshawar vs Quetta",         time:"3 minutes ago",   hash:"0xab12...cd34" },
  { dot:"purple", txt:"Sponsor airdrop sent — Pepsi 50 tokens",     time:"5 minutes ago",   hash:"0xef56...gh78" },
]

export default function TransactionFeed() {
  return (
    <div className="ap-card">
      <div className="ap-card-title">
        Live Transaction Feed
        <span style={{ fontSize:"10px", color:"#00C170" }}>● LIVE</span>
      </div>
      <div className="ap-feed">
        {FEED.map((f, i) => (
          <div className="ap-feed-item" key={i}>
            <div className={`ap-feed-dot ${f.dot}`} />
            <div className="ap-feed-info">
              <div className="ap-feed-txt">{f.txt}</div>
              <div className="ap-feed-time">{f.time}</div>
            </div>
            <div className="ap-feed-hash">{f.hash}</div>
          </div>
        ))}
      </div>
    </div>
  )
}