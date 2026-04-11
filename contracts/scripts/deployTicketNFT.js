const hre = require("hardhat")
const fs  = require("fs")
const path = require("path")

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("  Deploying TicketNFT to WireFluid...")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deployer wallet:", deployer.address)

  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log("Wallet balance: ", hre.ethers.formatEther(balance), "WIRE")

  // Deploy
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT")
  const ticketNFT = await TicketNFT.deploy()
  await ticketNFT.waitForDeployment()

  const address = await ticketNFT.getAddress()
  console.log("\n✅ TicketNFT deployed to:", address)
  console.log("🔍 View on WireScan: https://wirefluidscan.com/address/" + address)

  // Save address
  const deploymentsPath = path.join(__dirname, "../deployments/addresses.json")
  const existing = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"))
  existing.TicketNFT = address
  fs.writeFileSync(deploymentsPath, JSON.stringify(existing, null, 2))
  console.log("✅ Address saved to deployments/addresses.json")

  // Create all 8 PSL matches
  console.log("\n📅 Creating PSL matches on WireFluid...")

  const matches = [
    {
      name:  "Karachi Kings vs Lahore Qalandars",
      team1: "Karachi Kings",
      team2: "Lahore Qalandars",
      venue: "National Stadium, Karachi",
      date:  "April 14, 2026",
      price: hre.ethers.parseEther("0.005"),
      cap:   hre.ethers.parseEther("0.008"),
      seats: 200
    },
    {
      name:  "Peshawar Zalmi vs Quetta Gladiators",
      team1: "Peshawar Zalmi",
      team2: "Quetta Gladiators",
      venue: "Gaddafi Stadium, Lahore",
      date:  "April 15, 2026",
      price: hre.ethers.parseEther("0.007"),
      cap:   hre.ethers.parseEther("0.012"),
      seats: 150
    },
    {
      name:  "Islamabad United vs Multan Sultans",
      team1: "Islamabad United",
      team2: "Multan Sultans",
      venue: "Rawalpindi Cricket Stadium",
      date:  "April 16, 2026",
      price: hre.ethers.parseEther("0.010"),
      cap:   hre.ethers.parseEther("0.015"),
      seats: 100
    },
    {
      name:  "Lahore Qalandars vs Peshawar Zalmi",
      team1: "Lahore Qalandars",
      team2: "Peshawar Zalmi",
      venue: "Gaddafi Stadium, Lahore",
      date:  "April 17, 2026",
      price: hre.ethers.parseEther("0.006"),
      cap:   hre.ethers.parseEther("0.009"),
      seats: 180
    },
    {
      name:  "Hyderabad Kingsmen vs Karachi Kings",
      team1: "Hyderabad Kingsmen",
      team2: "Karachi Kings",
      venue: "National Stadium, Karachi",
      date:  "April 18, 2026",
      price: hre.ethers.parseEther("0.006"),
      cap:   hre.ethers.parseEther("0.009"),
      seats: 160
    },
    {
      name:  "Rawalpindiz vs Islamabad United",
      team1: "Rawalpindiz",
      team2: "Islamabad United",
      venue: "Rawalpindi Cricket Stadium",
      date:  "April 19, 2026",
      price: hre.ethers.parseEther("0.007"),
      cap:   hre.ethers.parseEther("0.010"),
      seats: 140
    },
    {
      name:  "Multan Sultans vs Hyderabad Kingsmen",
      team1: "Multan Sultans",
      team2: "Hyderabad Kingsmen",
      venue: "Multan Cricket Stadium",
      date:  "April 20, 2026",
      price: hre.ethers.parseEther("0.006"),
      cap:   hre.ethers.parseEther("0.009"),
      seats: 170
    },
    {
      name:  "Quetta Gladiators vs Rawalpindiz",
      team1: "Quetta Gladiators",
      team2: "Rawalpindiz",
      venue: "National Stadium, Karachi",
      date:  "April 21, 2026",
      price: hre.ethers.parseEther("0.008"),
      cap:   hre.ethers.parseEther("0.012"),
      seats: 120
    },
  ]

  for (const m of matches) {
    const tx = await ticketNFT.createMatch(
      m.name, m.team1, m.team2,
      m.venue, m.date,
      m.price, m.cap, m.seats
    )
    const receipt = await tx.wait()
    console.log(`✅ Match created: ${m.name}`)
    console.log(`   Tx hash: ${receipt.hash}`)
  }

  console.log("\n🏏 TicketNFT fully deployed and all matches created!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})