import { useState } from "react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "../contracts/addresses"
import FanPassportABI from "../contracts/FanPassport.json"

const TIER_NAMES = ["Rookie", "Fan", "Die-Hard", "Legend"]

export function useFanPassport(signer, provider) {

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  function getContract(signerOrProvider) {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.FanPassport,
      FanPassportABI.abi,
      signerOrProvider || provider
    )
  }

  // Get full passport data for a wallet
  async function getPassport(walletAddress) {
    try {
      const contract = getContract(provider)
      const hasPass  = await contract.hasPassport(walletAddress)

      if (!hasPass) return null

      const p = await contract.getPassport(walletAddress)
      return {
        wallet:          p.wallet,
        reputationScore: Number(p.reputationScore),
        matchesAttended: Number(p.matchesAttended),
        cleanResales:    Number(p.cleanResales),
        violationCount:  Number(p.violationCount),
        tier:            TIER_NAMES[Number(p.currentTier)],
        tierIndex:       Number(p.currentTier),
        isBlacklisted:   p.isBlacklisted,
        trustScore:      calculateTrustScore(p),
      }
    } catch (err) {
      console.error("getPassport error:", err)
      return null
    }
  }

  // Create passport
  async function createPassport() {
    setLoading(true)
    try {
      const contract = getContract(signer)
      const tx       = await contract.createPassport()
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

  // Get attendance history
  async function getAttendanceHistory(walletAddress) {
    try {
      const contract = getContract(provider)
      const history  = await contract.getAttendanceHistory(walletAddress)
      return history.map(h => ({
        matchId:      Number(h.matchId),
        matchName:    h.matchName,
        timestamp:    new Date(Number(h.timestamp) * 1000).toLocaleDateString(),
        pointsEarned: Number(h.pointsEarned),
      }))
    } catch (err) {
      console.error("getAttendanceHistory error:", err)
      return []
    }
  }

  // Get rewards inbox
  async function getRewards(walletAddress) {
    try {
      const contract = getContract(provider)
      const rewards  = await contract.getRewardsInbox(walletAddress)
      return rewards.map((r, i) => ({
        index:       i,
        description: r.description,
        sponsor:     r.sponsor,
        timestamp:   new Date(Number(r.timestamp) * 1000).toLocaleDateString(),
        claimed:     r.claimed,
      }))
    } catch (err) {
      console.error("getRewards error:", err)
      return []
    }
  }

  // Claim a reward
  async function claimReward(rewardIndex) {
    setLoading(true)
    try {
      const contract = getContract(signer)
      const tx       = await contract.claimReward(rewardIndex)
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

  function calculateTrustScore(passport) {
    const total = Number(passport.matchesAttended) + Number(passport.cleanResales)
    if (total === 0) return 100
    const violations = Number(passport.violationCount)
    const score = Math.max(0, 100 - (violations * 15))
    return score
  }

  function getNextTierInfo(tierIndex, score) {
    const thresholds = [0, 100, 300, 700]
    const names      = ["Rookie", "Fan", "Die-Hard", "Legend"]
    if (tierIndex >= 3) return { name:"Max Tier", needed:0, progress:100 }
    const next    = thresholds[tierIndex + 1]
    const current = thresholds[tierIndex]
    const progress = Math.round(((score - current) / (next - current)) * 100)
    return {
      name:     names[tierIndex + 1],
      needed:   next - score,
      progress: Math.min(100, Math.max(0, progress))
    }
  }

  return {
    loading, error,
    getPassport,
    createPassport,
    getAttendanceHistory,
    getRewards,
    claimReward,
    getNextTierInfo,
  }
}