import { createContext, useContext, useState } from "react"

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}