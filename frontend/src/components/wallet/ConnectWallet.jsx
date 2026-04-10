import { WIREFLUID_NETWORK } from "../../constants/network"

export default function ConnectWallet({ onConnected, primary }) {

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not found! Please install MetaMask from metamask.io")
      return
    }

    try {
      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })

      // Check if already on WireFluid network
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      if (chainId !== WIREFLUID_NETWORK.chainId) {
        try {
          // Try switching to WireFluid
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: WIREFLUID_NETWORK.chainId }]
          })
        } catch (switchError) {
          // If network not added yet, add it automatically
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [WIREFLUID_NETWORK]
            })
          }
        }
      }

      // Connected successfully
      if (onConnected) onConnected(accounts[0])

    } catch (error) {
      console.error("Wallet connection failed:", error)
    }
  }

  return (
    <button
      onClick={connect}
      className={primary ? "lv2-btn-p" : ""}
      style={!primary ? {
        background: "transparent",
        color: "#F0F4FF",
        border: "0.5px solid rgba(240,244,255,0.2)",
        padding: "10px 20px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "14px",
        cursor: "pointer",
      } : {}}
    >
      🦊 Connect Wallet
    </button>
  )
}