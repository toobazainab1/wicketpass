import { createContext, useContext, useState } from "react"

const FanContext = createContext()

export function FanProvider({ children }) {
  const [fan, setFan] = useState(null)
  return (
    <FanContext.Provider value={{ fan, setFan }}>
      {children}
    </FanContext.Provider>
  )
}

export function useFan() {
  return useContext(FanContext)
}