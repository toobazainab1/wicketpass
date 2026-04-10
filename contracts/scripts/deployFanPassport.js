const hre  = require("hardhat")
const fs   = require("fs")
const path = require("path")

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("  Deploying FanPassport to WireFluid...")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deployer wallet:", deployer.address)

  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log("Wallet balance: ", hre.ethers.formatEther(balance), "WIRE")

  // Deploy
  const FanPassport = await hre.ethers.getContractFactory("FanPassport")
  const fanPassport = await FanPassport.deploy()
  await fanPassport.waitForDeployment()

  const address = await fanPassport.getAddress()
  console.log("\n✅ FanPassport deployed to:", address)
  console.log("🔍 View on WireScan: https://wirefluidscan.com/address/" + address)

  // Save address
  const deploymentsPath = path.join(__dirname, "../deployments/addresses.json")
  const existing = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"))
  existing.FanPassport = address
  fs.writeFileSync(deploymentsPath, JSON.stringify(existing, null, 2))
  console.log("✅ Address saved to deployments/addresses.json")

  // Link FanPassport to TicketNFT
  if (existing.TicketNFT) {
    console.log("\n🔗 Linking FanPassport to TicketNFT...")
    const tx = await fanPassport.setTicketNFTContract(existing.TicketNFT)
    const receipt = await tx.wait()
    console.log("✅ TicketNFT linked to FanPassport")
    console.log("   Tx hash:", receipt.hash)
  } else {
    console.log("⚠️  TicketNFT address not found — deploy TicketNFT first")
  }

  console.log("\n🏏 FanPassport fully deployed!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})