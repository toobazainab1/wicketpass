import { useState } from "react"

const INITIAL = [
  { wallet:"0xAB12...CD34", reason:"Price Cap Violation", date:"Apr 10" },
  { wallet:"0xEF56...GH78", reason:"Fake Ticket Attempt", date:"Apr 11" },
  { wallet:"0xIJ90...KL12", reason:"Bulk Buying",         date:"Apr 12" },
]

export default function BlacklistTable() {
  const [list, setList] = useState(INITIAL)

  function clear(i) {
    setList(list.map((item, idx) =>
      idx === i ? { ...item, cleared: true } : item
    ))
  }

  return (
    <div className="ap-card">
      <div className="ap-card-title">Blacklist Management</div>
      <div className="ap-blacklist-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr key={i} style={{ opacity: item.cleared ? 0.3 : 1, transition:"opacity 0.4s" }}>
                <td><div className="ap-wallet-txt">{item.wallet}</div></td>
                <td><span className="ap-reason-badge">{item.reason}</span></td>
                <td className="ap-date-txt">{item.date}</td>
                <td>
                  <button
                    className="ap-clear-btn"
                    onClick={() => clear(i)}
                    disabled={item.cleared}
                    style={item.cleared ? { color:"#00C170", borderColor:"rgba(0,193,112,0.4)" } : {}}
                  >
                    {item.cleared ? "Cleared ✓" : "Clear"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}