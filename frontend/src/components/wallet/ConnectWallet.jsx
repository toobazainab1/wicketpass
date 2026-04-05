export default function ConnectWallet({ onConnected, primary }) {
  return (
    <button
      onClick={onConnected}
      style={{
        background: primary ? "#00C170" : "transparent",
        color: primary ? "#080B14" : "#F0F4FF",
        border: primary ? "none" : "0.5px solid rgba(240,244,255,0.2)",
        padding: "14px 32px",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "15px",
        cursor: "pointer",
        boxShadow: primary ? "0 0 32px rgba(0,193,112,0.35)" : "none"
      }}
    >
      Connect Wallet
    </button>
  )
}