import { useState } from "react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "../contracts/addresses"
import MarketplaceABI from "../contracts/Marketplace.json"
import TicketNFTABI from "../contracts/TicketNFT.json"

export function useMarketplace(signer, provider) {

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  function getMarketplace(signerOrProvider) {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.Marketplace,
      MarketplaceABI.abi,
      signerOrProvider || provider
    )
  }

  function getTicketNFT(signerOrProvider) {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.TicketNFT,
      TicketNFTABI.abi,
      signerOrProvider || provider
    )
  }

  // Get all active listings
  async function getListings() {
    try {
      const contract  = getMarketplace(provider)
      const tokenIds  = await contract.getActiveListings()
      const listings  = []

      for (const id of tokenIds) {
        const listing = await contract.getListing(id)
        if (!listing.isActive) continue

        const ticketContract = getTicketNFT(provider)
        const ticket = await ticketContract.getTicket(id)

        listings.push({
          tokenId:  Number(id),
          seller:   listing.seller,
          price:    ethers.formatEther(listing.price),
          priceWei: listing.price,
          priceCap: ethers.formatEther(listing.priceCap),
          matchName:ticket.matchName,
          venue:    ticket.venue,
          date:     ticket.date,
          seat:     ticket.seat,
          stand:    ticket.stand,
        })
      }
      return listings
    } catch (err) {
      console.error("getListings error:", err)
      return []
    }
  }

  // List a ticket for resale
  async function listTicket(tokenId, priceInWire) {
    setLoading(true)
    setError(null)
    try {
      const priceWei       = ethers.parseEther(priceInWire.toString())
      const ticketContract = getTicketNFT(signer)
      const marketplace    = getMarketplace(signer)

      // Approve marketplace to transfer NFT
      const approveTx = await ticketContract.approve(
        CONTRACT_ADDRESSES.Marketplace,
        tokenId
      )
      await approveTx.wait()

      // List on marketplace
      const listTx  = await marketplace.listTicket(tokenId, priceWei)
      const receipt = await listTx.wait()

      return {
        success: true,
        txHash:  receipt.hash,
        wirescan:`https://wirefluidscan.com/tx/${receipt.hash}`
      }
    } catch (err) {
      setError(err.message)
      console.error("listTicket error:", err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Buy a resale ticket
  async function buyListing(tokenId, priceWei) {
    setLoading(true)
    setError(null)
    try {
      const contract = getMarketplace(signer)
      const tx       = await contract.buyTicket(tokenId, { value: priceWei })
      const receipt  = await tx.wait()
      return {
        success: true,
        txHash:  receipt.hash,
        wirescan:`https://wirefluidscan.com/tx/${receipt.hash}`
      }
    } catch (err) {
      setError(err.message)
      console.error("buyListing error:", err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Delist a ticket
  async function delistTicket(tokenId) {
    setLoading(true)
    try {
      const contract = getMarketplace(signer)
      const tx       = await contract.delistTicket(tokenId)
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

  // Get marketplace stats
  async function getStats() {
    try {
      const contract = getMarketplace(provider)
      const stats    = await contract.getMarketplaceStats()
      return {
        totalResales:  Number(stats.totalResales_),
        totalVolume:   ethers.formatEther(stats.totalVolume_),
        activeListings:Number(stats.activeCount_),
      }
    } catch (err) {
      console.error("getStats error:", err)
      return { totalResales:0, totalVolume:"0", activeListings:0 }
    }
  }

  return {
    loading, error,
    getListings,
    listTicket,
    buyListing,
    delistTicket,
    getStats,
  }
}