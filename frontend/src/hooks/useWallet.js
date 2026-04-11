import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { WIREFLUID_NETWORK } from "../constants/network"

export function useWallet() {
  const [wallet, setWallet]     = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    checkIfConnected()
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", () => window.location.reload())
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  async function checkIfConnected() {
    if (!window.ethereum) return
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        await setupProvider(accounts[0])
      }
    } catch (err) {
      console.error("Check connection error:", err)
    }
  }

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setWallet(null)
      setProvider(null)
      setSigner(null)
    } else {
      await setupProvider(accounts[0])
    }
  }

  async function setupProvider(account) {
    const web3Provider = new ethers.BrowserProvider(window.ethereum)
    const web3Signer   = await web3Provider.getSigner()
    setProvider(web3Provider)
    setSigner(web3Signer)
    setWallet(account)
  }

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not found! Install from metamask.io")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })

      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      if (chainId !== WIREFLUID_NETWORK.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: WIREFLUID_NETWORK.chainId }]
          })
        } catch (switchErr) {
          if (switchErr.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [WIREFLUID_NETWORK]
            })
          }
        }
      }

      await setupProvider(accounts[0])
    } catch (err) {
      setError(err.message)
      console.error("Connect error:", err)
    } finally {
      setLoading(false)
    }
  }

  function disconnect() {
    setWallet(null)
    setProvider(null)
    setSigner(null)
  }

  function shortAddress(addr) {
    if (!addr) return ""
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

  return { wallet, provider, signer, loading, error, connect, disconnect, shortAddress }
}