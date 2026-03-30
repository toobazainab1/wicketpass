import { createBrowserRouter } from "react-router-dom"
import Landing          from "./pages/Landing"
import FanPortal        from "./pages/FanPortal"
import FanPassport      from "./pages/FanPassport"
import Marketplace      from "./pages/Marketplace"
import GateVerification from "./pages/GateVerification"
import AdminPanel       from "./pages/AdminPanel"

export const router = createBrowserRouter([
  { path: "/",            element: <Landing /> },
  { path: "/portal",      element: <FanPortal /> },
  { path: "/passport",    element: <FanPassport /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/gate",        element: <GateVerification /> },
  { path: "/admin",       element: <AdminPanel /> },
])