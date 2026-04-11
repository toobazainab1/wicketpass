import { useState } from "react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "../contracts/addresses"
import TicketNFTABI from "../contracts/TicketNFT.json"

export function useTicketNFT(signer, provider) {

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  function getContract(signerOrProvider) {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.TicketNFT,
      TicketNFTABI.abi,
      signerOrProvider || provider
    )
  }

  // Get all active matches from blockchain
  async function getActiveMatches() {
    try {
      const contract    = getContract(provider)
      const matchIds    = await contract.getActiveMatches()
      const matchData   = []

      for (const id of matchIds) {
        const m = await contract.getMatch(id)
        matchData.push({
          id:       Number(m.matchId),
          matchName:m.matchName,
          team1:    m.team1,
          team2:    m.team2,
          venue:    m.venue,
          date:     m.date,
          price:    ethers.formatEther(m.ticketPrice),
          priceWei: m.ticketPrice,
          cap:      ethers.formatEther(m.resalePriceCap),
          seats:    Number(m.totalSeats),
          sold:     Number(m.soldSeats),
          available:Number(m.totalSeats) - Number(m.soldSeats),
          isActive: m.isActive,
        })
      }
      return matchData
    } catch (err) {
      console.error("getActiveMatches error:", err)
      return []
    }
  }

  // Buy a ticket
  async function buyTicket(matchId, seat, stand, priceWei) {
    setLoading(true)
    setError(null)
    try {
      const contract = getContract(signer)
      const tokenURI = `ipfs://wicketpass/match-${matchId}-seat-${seat}`
      const tx = await contract.buyTicket(
        matchId, seat, stand, tokenURI,
        { value: priceWei }
      )
      const receipt = await tx.wait()
      return {
        success: true,
        txHash:  receipt.hash,
        wirescan:`https://wirefluidscan.com/tx/${receipt.hash}`
      }
    } catch (err) {
      setError(err.message)
      console.error("buyTicket error:", err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Get all tickets owned by wallet
  async function getMyTickets(walletAddress) {
    try {
      const contract   = getContract(provider)
      const tokenIds   = await contract.getOwnerTickets(walletAddress)
      const tickets    = []

      for (const id of tokenIds) {
        try {
          const t = await contract.getTicket(id)
          tickets.push({
            tokenId:   Number(t.tokenId),
            matchId:   Number(t.matchId),
            matchName: t.matchName,
            venue:     t.venue,
            date:      t.date,
            seat:      t.seat,
            stand:     t.stand,
            price:     ethers.formatEther(t.originalPrice),
            cap:       ethers.formatEther(t.resalePriceCap),
            isUsed:    t.isUsed,
            isListed:  t.isListed,
          })
        } catch {
          continue
        }
      }
      return tickets
    } catch (err) {
      console.error("getMyTickets error:", err)
      return []
    }
  }

  // Verify ticket at gate
  async function verifyTicket(tokenId) {
    try {
      const contract = getContract(provider)
      const result   = await contract.verifyTicket(tokenId)
      return {
        isValid:      result.isValid,
        isUsed:       result.isUsed,
        currentOwner: result.currentOwner,
        matchName:    result.matchName,
        seat:         result.seat,
        stand:        result.stand,
        date:         result.date,
      }
    } catch (err) {
      console.error("verifyTicket error:", err)
      return { isValid: false, error: err.message }
    }
  }

  // Scan ticket at gate
  async function scanTicket(tokenId) {
    setLoading(true)
    try {
      const contract = getContract(signer)
      const tx       = await contract.scanTicketAtGate(tokenId)
      const receipt  = await tx.wait()
      return {
        success: true,
        txHash:  receipt.hash,
        wirescan:`https://wirefluidscan.com/tx/${receipt.hash}`
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading, error,
    getActiveMatches,
    buyTicket,
    getMyTickets,
    verifyTicket,
    scanTicket,
  }
}