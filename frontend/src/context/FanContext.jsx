import { createContext, useContext, useState, useEffect } from "react"
import { useFanPassport } from "../hooks/useFanPassport"
import { useWalletContext } from "./WalletContext"

const FanContext = createContext()

export function FanProvider({ children }) {
  const { wallet, provider, signer } = useWalletContext()
  const { getPassport, getAttendanceHistory, getRewards } = useFanPassport(signer, provider)

  const [passport, setPassport]   = useState(null)
  const [history, setHistory]     = useState([])
  const [rewards, setRewards]     = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (wallet && provider) {
      loadFanData()
    } else {
      setPassport(null)
      setHistory([])
      setRewards([])
    }
  }, [wallet, provider])

  async function loadFanData() {
    setLoading(true)
    try {
      const [p, h, r] = await Promise.all([
        getPassport(wallet),
        getAttendanceHistory(wallet),
        getRewards(wallet),
      ])
      setPassport(p)
      setHistory(h)
      setRewards(r)
    } catch (err) {
      console.error("loadFanData error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FanContext.Provider value={{ passport, history, rewards, loading, reload: loadFanData }}>
      {children}
    </FanContext.Provider>
  )
}

export function useFanContext() {
  return useContext(FanContext)
}