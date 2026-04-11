import { useWalletContext } from "../../context/WalletContext"

export default function ConnectWallet({ onConnected, primary }) {
  const { wallet, connect, loading, shortAddress } = useWalletContext()

  async function handleClick() {
    if (!wallet) {
      await connect()
      if (onConnected) onConnected()
    } else {
      if (onConnected) onConnected()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={primary ? "lv2-btn-p" : "fp-wallet"}
      disabled={loading}
    >
      {loading
        ? "Connecting..."
        : wallet
        ? shortAddress(wallet)
        : "🦊 Connect Wallet"}
    </button>
  )
}