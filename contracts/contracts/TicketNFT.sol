// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721URIStorage, Ownable {

    // ── State Variables ──────────────────────────────────────────

    uint256 private _tokenIdCounter;

    address public fanPassportContract;
    address public marketplaceContract;

    struct Ticket {
        uint256 tokenId;
        uint256 matchId;
        string  matchName;
        string  venue;
        string  date;
        string  seat;
        string  stand;
        uint256 originalPrice;
        uint256 resalePriceCap;
        address originalBuyer;
        bool    isUsed;
        bool    isListed;
    }

    struct Match {
        uint256 matchId;
        string  matchName;
        string  team1;
        string  team2;
        string  venue;
        string  date;
        uint256 ticketPrice;
        uint256 resalePriceCap;
        uint256 totalSeats;
        uint256 soldSeats;
        bool    isActive;
    }

    mapping(uint256 => Match)    public matches;
    mapping(uint256 => Ticket)   public tickets;
    mapping(address => uint256[]) public ownerTickets;

    uint256 public matchCount;
    uint256 public totalRoyaltyEarned;
    uint256 public royaltyPercent = 10;


    // ── Events ───────────────────────────────────────────────────

    event MatchCreated(uint256 indexed matchId, string matchName, uint256 ticketPrice, uint256 totalSeats);
    event TicketMinted(uint256 indexed tokenId, uint256 indexed matchId, address indexed buyer, string seat);
    event TicketScanned(uint256 indexed tokenId, address indexed fan, uint256 timestamp);
    event TicketResold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    event RoyaltyPaid(uint256 indexed tokenId, uint256 amount, address paidTo);


    // ── Constructor ──────────────────────────────────────────────

    constructor() ERC721("WicketPass Ticket", "WPTIX") Ownable(msg.sender) {}


    // ── Admin Functions ───────────────────────────────────────────

    function setFanPassportContract(address _addr) external onlyOwner {
        fanPassportContract = _addr;
    }

    function setMarketplaceContract(address _addr) external onlyOwner {
        marketplaceContract = _addr;
    }

    function setRoyaltyPercent(uint256 _percent) external onlyOwner {
        require(_percent <= 20, "Royalty cannot exceed 20%");
        royaltyPercent = _percent;
    }

    function createMatch(
        string memory _matchName,
        string memory _team1,
        string memory _team2,
        string memory _venue,
        string memory _date,
        uint256 _ticketPrice,
        uint256 _resalePriceCap,
        uint256 _totalSeats
    ) external onlyOwner returns (uint256) {
        require(_resalePriceCap >= _ticketPrice, "Resale cap must be >= original price");
        require(_totalSeats > 0, "Must have at least 1 seat");

        matchCount++;
        matches[matchCount] = Match({
            matchId:        matchCount,
            matchName:      _matchName,
            team1:          _team1,
            team2:          _team2,
            venue:          _venue,
            date:           _date,
            ticketPrice:    _ticketPrice,
            resalePriceCap: _resalePriceCap,
            totalSeats:     _totalSeats,
            soldSeats:      0,
            isActive:       true
        });

        emit MatchCreated(matchCount, _matchName, _ticketPrice, _totalSeats);
        return matchCount;
    }

    function deactivateMatch(uint256 _matchId) external onlyOwner {
        require(matches[_matchId].matchId != 0, "Match does not exist");
        matches[_matchId].isActive = false;
    }


    // ── Fan Functions ─────────────────────────────────────────────

    function buyTicket(
        uint256 _matchId,
        string memory _seat,
        string memory _stand,
        string memory _tokenURI
    ) external payable returns (uint256) {
        Match storage m = matches[_matchId];

        require(m.matchId != 0,             "Match does not exist");
        require(m.isActive,                 "Match is not active");
        require(m.soldSeats < m.totalSeats, "Match is sold out");
        require(msg.value >= m.ticketPrice, "Insufficient payment");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        tickets[newTokenId] = Ticket({
            tokenId:        newTokenId,
            matchId:        _matchId,
            matchName:      m.matchName,
            venue:          m.venue,
            date:           m.date,
            seat:           _seat,
            stand:          _stand,
            originalPrice:  m.ticketPrice,
            resalePriceCap: m.resalePriceCap,
            originalBuyer:  msg.sender,
            isUsed:         false,
            isListed:       false
        });

        ownerTickets[msg.sender].push(newTokenId);
        m.soldSeats++;

        payable(owner()).transfer(msg.value);

        emit TicketMinted(newTokenId, _matchId, msg.sender, _seat);
        return newTokenId;
    }


    // ── Gate Verification ─────────────────────────────────────────

    function scanTicketAtGate(uint256 _tokenId) external {
        require(
            msg.sender == owner() || msg.sender == fanPassportContract,
            "Not authorized to scan"
        );
        require(_ownerOf(_tokenId) != address(0), "Ticket does not exist");
        require(!tickets[_tokenId].isUsed,         "Ticket already used");

        tickets[_tokenId].isUsed = true;

        emit TicketScanned(_tokenId, ownerOf(_tokenId), block.timestamp);
    }

    function verifyTicket(uint256 _tokenId) external view returns (
        bool isValid,
        bool isUsed,
        address currentOwner,
        string memory matchName,
        string memory seat,
        string memory stand,
        string memory date
    ) {
        require(_ownerOf(_tokenId) != address(0), "Ticket does not exist");
        Ticket memory t = tickets[_tokenId];
        return (
            !t.isUsed,
            t.isUsed,
            ownerOf(_tokenId),
            t.matchName,
            t.seat,
            t.stand,
            t.date
        );
    }


    // ── Resale Helpers ────────────────────────────────────────────

    function setTicketListed(uint256 _tokenId, bool _listed) external {
        require(msg.sender == marketplaceContract, "Only marketplace can call this");
        require(_ownerOf(_tokenId) != address(0), "Ticket does not exist");
        require(!tickets[_tokenId].isUsed,         "Cannot list used ticket");
        tickets[_tokenId].isListed = _listed;
    }

    function executeResale(
        uint256 _tokenId,
        address _seller,
        address _buyer,
        uint256 _salePrice
    ) external payable {
        require(msg.sender == marketplaceContract,                    "Only marketplace can call this");
        require(_ownerOf(_tokenId) != address(0),                    "Ticket does not exist");
        require(!tickets[_tokenId].isUsed,                           "Cannot resell used ticket");
        require(_salePrice <= tickets[_tokenId].resalePriceCap,      "Price exceeds cap");
        require(ownerOf(_tokenId) == _seller,                        "Seller does not own ticket");

        uint256 royalty      = (_salePrice * royaltyPercent) / 100;
        uint256 sellerAmount = _salePrice - royalty;

        _transfer(_seller, _buyer, _tokenId);
        tickets[_tokenId].isListed = false;

        ownerTickets[_buyer].push(_tokenId);

        payable(owner()).transfer(royalty);
        totalRoyaltyEarned += royalty;

        payable(_seller).transfer(sellerAmount);

        emit TicketResold(_tokenId, _seller, _buyer, _salePrice);
        emit RoyaltyPaid(_tokenId, royalty, owner());
    }


    // ── View Functions ────────────────────────────────────────────

    function getOwnerTickets(address _owner) external view returns (uint256[] memory) {
        return ownerTickets[_owner];
    }

    function getTicket(uint256 _tokenId) external view returns (Ticket memory) {
        require(_ownerOf(_tokenId) != address(0), "Ticket does not exist");
        return tickets[_tokenId];
    }

    function getMatch(uint256 _matchId) external view returns (Match memory) {
        require(matches[_matchId].matchId != 0, "Match does not exist");
        return matches[_matchId];
    }

    function getActiveMatches() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= matchCount; i++) {
            if (matches[i].isActive) activeCount++;
        }
        uint256[] memory activeMatchIds = new uint256[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= matchCount; i++) {
            if (matches[i].isActive) {
                activeMatchIds[index] = i;
                index++;
            }
        }
        return activeMatchIds;
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }


    // ── Overrides ─────────────────────────────────────────────────

    function tokenURI(uint256 tokenId)
        public view override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}