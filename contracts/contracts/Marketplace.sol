// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITicketNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getTicket(uint256 tokenId) external view returns (
        uint256 tokenId_,
        uint256 matchId,
        string memory matchName,
        string memory venue,
        string memory date,
        string memory seat,
        string memory stand,
        uint256 originalPrice,
        uint256 resalePriceCap,
        address originalBuyer,
        bool isUsed,
        bool isListed
    );
    function setTicketListed(uint256 tokenId, bool listed) external;
    function executeResale(uint256 tokenId, address seller, address buyer, uint256 salePrice) external payable;
    function approve(address to, uint256 tokenId) external;
}

interface IFanPassport {
    function recordResale(address fan, bool wasClean) external;
    function hasPassport(address wallet) external view returns (bool);
}

contract Marketplace is Ownable, ReentrancyGuard {

    // ── State Variables ──────────────────────────────────────────

    ITicketNFT    public ticketNFT;
    IFanPassport  public fanPassport;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 priceCap;
        bool    isActive;
        uint256 listedAt;
    }

    // tokenId => Listing
    mapping(uint256 => Listing) public listings;

    // All active listing tokenIds
    uint256[] public activeListings;

    // Total resales completed
    uint256 public totalResales;

    // Total volume traded
    uint256 public totalVolume;


    // ── Events ───────────────────────────────────────────────────

    event TicketListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event TicketDelisted(uint256 indexed tokenId, address indexed seller);
    event TicketSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);


    // ── Constructor ──────────────────────────────────────────────

    constructor(address _ticketNFT, address _fanPassport) Ownable(msg.sender) {
        ticketNFT   = ITicketNFT(_ticketNFT);
        fanPassport = IFanPassport(_fanPassport);
    }


    // ── Seller Functions ──────────────────────────────────────────

    function listTicket(uint256 _tokenId, uint256 _price) external nonReentrant {
        require(ticketNFT.ownerOf(_tokenId) == msg.sender, "You do not own this ticket");

        (
            ,,,,,,,
            uint256 originalPrice,
            uint256 resalePriceCap,
            ,
            bool isUsed,
            bool isListed
        ) = ticketNFT.getTicket(_tokenId);

        require(!isUsed,                    "Cannot list used ticket");
        require(!isListed,                  "Ticket already listed");
        require(_price <= resalePriceCap,   "Price exceeds cap");
        require(_price >= originalPrice / 2, "Price too low");

        listings[_tokenId] = Listing({
            tokenId:  _tokenId,
            seller:   msg.sender,
            price:    _price,
            priceCap: resalePriceCap,
            isActive: true,
            listedAt: block.timestamp
        });

        activeListings.push(_tokenId);
        ticketNFT.setTicketListed(_tokenId, true);

        emit TicketListed(_tokenId, msg.sender, _price);
    }

    function delistTicket(uint256 _tokenId) external nonReentrant {
        require(listings[_tokenId].seller == msg.sender, "You did not list this ticket");
        require(listings[_tokenId].isActive,             "Listing not active");

        listings[_tokenId].isActive = false;
        ticketNFT.setTicketListed(_tokenId, false);

        emit TicketDelisted(_tokenId, msg.sender);
    }


    // ── Buyer Functions ───────────────────────────────────────────

    function buyTicket(uint256 _tokenId) external payable nonReentrant {
        Listing storage listing = listings[_tokenId];

        require(listing.isActive,                    "Listing not active");
        require(msg.sender != listing.seller,        "Cannot buy your own ticket");
        require(msg.value >= listing.price,          "Insufficient payment");
        require(listing.price <= listing.priceCap,  "Price exceeds cap");

        address seller = listing.seller;
        uint256 price  = listing.price;

        // Mark listing inactive
        listing.isActive = false;

        // Execute resale via TicketNFT contract
        // This handles NFT transfer + royalty payment
        ticketNFT.executeResale{ value: msg.value }(
            _tokenId,
            seller,
            msg.sender,
            price
        );

        // Record clean resale in FanPassport
        if (fanPassport.hasPassport(seller)) {
            fanPassport.recordResale(seller, true);
        }

        // Update stats
        totalResales++;
        totalVolume += price;

        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit TicketSold(_tokenId, seller, msg.sender, price);
    }


    // ── View Functions ────────────────────────────────────────────

    function getListing(uint256 _tokenId) external view returns (Listing memory) {
        return listings[_tokenId];
    }

    function getActiveListings() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (listings[activeListings[i]].isActive) count++;
        }

        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (listings[activeListings[i]].isActive) {
                result[index] = activeListings[i];
                index++;
            }
        }
        return result;
    }

    function getMarketplaceStats() external view returns (
        uint256 totalResales_,
        uint256 totalVolume_,
        uint256 activeCount_
    ) {
        uint256 active = 0;
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (listings[activeListings[i]].isActive) active++;
        }
        return (totalResales, totalVolume, active);
    }
}