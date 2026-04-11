const hre  = require("hardhat")
const fs   = require("fs")
const path = require("path")

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("  Deploying Marketplace to WireFluid...")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deployer wallet:", deployer.address)

  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log("Wallet balance: ", hre.ethers.formatEther(balance), "WIRE")

  // Load existing addresses
  const deploymentsPath = path.join(__dirname, "../deployments/addresses.json")
  const existing = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"))

  if (!existing.TicketNFT || !existing.FanPassport) {
    console.error("❌ Deploy TicketNFT and FanPassport first!")
    process.exit(1)
  }

  console.log("Using TicketNFT:  ", existing.TicketNFT)
  console.log("Using FanPassport:", existing.FanPassport)

  // Deploy
  const Marketplace = await hre.ethers.getContractFactory("Marketplace")
  const marketplace = await Marketplace.deploy(
    existing.TicketNFT,
    existing.FanPassport
  )
  await marketplace.waitForDeployment()

  const address = await marketplace.getAddress()
  console.log("\n✅ Marketplace deployed to:", address)
  console.log("🔍 View on WireScan: https://wirefluidscan.com/address/" + address)

  // Save address
  existing.Marketplace = address
  fs.writeFileSync(deploymentsPath, JSON.stringify(existing, null, 2))
  console.log("✅ Address saved to deployments/addresses.json")

  // Link Marketplace to TicketNFT
  console.log("\n🔗 Linking Marketplace to TicketNFT...")
  const TicketNFT = await hre.ethers.getContractAt("TicketNFT", existing.TicketNFT)
  const tx1 = await TicketNFT.setMarketplaceContract(address)
  const receipt1 = await tx1.wait()
  console.log("✅ Marketplace linked to TicketNFT")
  console.log("   Tx hash:", receipt1.hash)

  // Link Marketplace to FanPassport
  console.log("\n🔗 Linking Marketplace to FanPassport...")
  const FanPassport = await hre.ethers.getContractAt("FanPassport", existing.FanPassport)
  const tx2 = await FanPassport.setTicketNFTContract(address)
  const receipt2 = await tx2.wait()
  console.log("✅ Marketplace linked to FanPassport")
  console.log("   Tx hash:", receipt2.hash)

  console.log("\n🏏 All 3 contracts fully deployed and linked!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("\n📋 Final Contract Addresses:")
  console.log("   TicketNFT:   ", existing.TicketNFT)
  console.log("   FanPassport: ", existing.FanPassport)
  console.log("   Marketplace: ", address)
  console.log("\n🔍 Verify all on WireScan:")
  console.log("   https://wirefluidscan.com/address/" + existing.TicketNFT)
  console.log("   https://wirefluidscan.com/address/" + existing.FanPassport)
  console.log("   https://wirefluidscan.com/address/" + address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})