import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { WalletProvider } from "./context/WalletContext"
import { FanProvider } from "./context/FanContext"

function App() {
  return (
    <WalletProvider>
      <FanProvider>
        <RouterProvider router={router} />
      </FanProvider>
    </WalletProvider>
  )
}

export default App