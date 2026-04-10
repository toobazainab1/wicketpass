const { expect } = require("chai")
const { ethers } = require("hardhat")


describe("TicketNFT", function () {
  let ticketNFT
  let owner
  let fan1
  let fan2

  beforeEach(async function () {
    ;[owner, fan1, fan2] = await ethers.getSigners()
    const TicketNFT = await ethers.getContractFactory("TicketNFT")
    ticketNFT = await TicketNFT.deploy()
    await ticketNFT.waitForDeployment()
  })

  describe("Match Creation", function () {
    it("Should allow owner to create a match", async function () {
      await ticketNFT.createMatch(
        "Karachi vs Lahore", "Karachi Kings", "Lahore Qalandars",
        "National Stadium", "April 14 2026",
        ethers.parseEther("0.005"), ethers.parseEther("0.008"), 200
      )
      const match = await ticketNFT.getMatch(1)
      expect(match.matchName).to.equal("Karachi vs Lahore")
      expect(match.totalSeats).to.equal(200)
      expect(match.isActive).to.be.true
    })

    it("Should reject match creation from non-owner", async function () {
      await expect(
        ticketNFT.connect(fan1).createMatch(
          "Karachi vs Lahore", "Karachi Kings", "Lahore Qalandars",
          "National Stadium", "April 14 2026",
          ethers.parseEther("0.005"), ethers.parseEther("0.008"), 200
        )
      ).to.be.reverted
    })

    it("Should reject if resale cap is less than price", async function () {
      await expect(
        ticketNFT.createMatch(
          "Karachi vs Lahore", "Karachi Kings", "Lahore Qalandars",
          "National Stadium", "April 14 2026",
          ethers.parseEther("0.008"), ethers.parseEther("0.005"), 200
        )
      ).to.be.revertedWith("Resale cap must be >= original price")
    })
  })

  describe("Ticket Minting", function () {
    beforeEach(async function () {
      await ticketNFT.createMatch(
        "Karachi vs Lahore", "Karachi Kings", "Lahore Qalandars",
        "National Stadium", "April 14 2026",
        ethers.parseEther("0.005"), ethers.parseEther("0.008"), 2
      )
    })

    it("Should mint ticket NFT to buyer", async function () {
      await ticketNFT.connect(fan1).buyTicket(
        1, "B-12", "West", "ipfs://metadata1",
        { value: ethers.parseEther("0.005") }
      )
      expect(await ticketNFT.ownerOf(1)).to.equal(fan1.address)
    })

    it("Should store correct ticket data", async function () {
      await ticketNFT.connect(fan1).buyTicket(
        1, "B-12", "West", "ipfs://metadata1",
        { value: ethers.parseEther("0.005") }
      )
      const ticket = await ticketNFT.getTicket(1)
      expect(ticket.seat).to.equal("B-12")
      expect(ticket.stand).to.equal("West")
      expect(ticket.isUsed).to.be.false
      expect(ticket.originalBuyer).to.equal(fan1.address)
    })

    it("Should reject purchase with insufficient payment", async function () {
      await expect(
        ticketNFT.connect(fan1).buyTicket(
          1, "B-12", "West", "ipfs://metadata1",
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWith("Insufficient payment")
    })

    it("Should reject when match is sold out", async function () {
      await ticketNFT.connect(fan1).buyTicket(
        1, "A-01", "West", "ipfs://1",
        { value: ethers.parseEther("0.005") }
      )
      await ticketNFT.connect(fan2).buyTicket(
        1, "A-02", "West", "ipfs://2",
        { value: ethers.parseEther("0.005") }
      )
      await expect(
        ticketNFT.connect(fan1).buyTicket(
          1, "A-03", "West", "ipfs://3",
          { value: ethers.parseEther("0.005") }
        )
      ).to.be.revertedWith("Match is sold out")
    })
  })

  describe("Gate Verification", function () {
    beforeEach(async function () {
      await ticketNFT.createMatch(
        "Karachi vs Lahore", "Karachi Kings", "Lahore Qalandars",
        "National Stadium", "April 14 2026",
        ethers.parseEther("0.005"), ethers.parseEther("0.008"), 200
      )
      await ticketNFT.connect(fan1).buyTicket(
        1, "B-12", "West", "ipfs://metadata1",
        { value: ethers.parseEther("0.005") }
      )
    })

    it("Should verify ticket as valid before scan", async function () {
      const result = await ticketNFT.verifyTicket(1)
      expect(result.isValid).to.be.true
      expect(result.isUsed).to.be.false
    })

    it("Should mark ticket as used after gate scan", async function () {
      await ticketNFT.scanTicketAtGate(1)
      const ticket = await ticketNFT.getTicket(1)
      expect(ticket.isUsed).to.be.true
    })

    it("Should reject double scanning same ticket", async function () {
      await ticketNFT.scanTicketAtGate(1)
      await expect(
        ticketNFT.scanTicketAtGate(1)
      ).to.be.revertedWith("Ticket already used")
    })

    it("Should reject gate scan from non-authorized address", async function () {
      await expect(
        ticketNFT.connect(fan1).scanTicketAtGate(1)
      ).to.be.revertedWith("Not authorized to scan")
    })
  })

  describe("View Functions", function () {
    it("Should return active matches", async function () {
      await ticketNFT.createMatch(
        "Match1", "T1", "T2", "Venue", "Date",
        ethers.parseEther("0.005"), ethers.parseEther("0.008"), 100
      )
      await ticketNFT.createMatch(
        "Match2", "T3", "T4", "Venue", "Date",
        ethers.parseEther("0.005"), ethers.parseEther("0.008"), 100
      )
      const active = await ticketNFT.getActiveMatches()
      expect(active.length).to.equal(2)
    })

    it("Should return owner tickets", async function () {
      await ticketNFT.createMatch(
        "Match1", "T1", "T2", "Venue", "Date",
        ethers.parseEther("0.005"), ethers.parseEther("0.008"), 100
      )
      await ticketNFT.connect(fan1).buyTicket(
        1, "A-01", "West", "ipfs://1",
        { value: ethers.parseEther("0.005") }
      )
      await ticketNFT.connect(fan1).buyTicket(
        1, "A-02", "West", "ipfs://2",
        { value: ethers.parseEther("0.005") }
      )
      const ownerTix = await ticketNFT.getOwnerTickets(fan1.address)
      expect(ownerTix.length).to.equal(2)
    })
  })
})