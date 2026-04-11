// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FanPassport is Ownable {

    // ── State Variables ──────────────────────────────────────────

    address public ticketNFTContract;

    enum Tier { Rookie, Fan, DieHard, Legend }

    struct Passport {
        address wallet;
        uint256 reputationScore;
        uint256 matchesAttended;
        uint256 cleanResales;
        uint256 violationCount;
        Tier    currentTier;
        bool    isBlacklisted;
        bool    exists;
    }

    struct Reward {
        string  description;
        string  sponsor;
        uint256 timestamp;
        bool    claimed;
    }

    struct AttendanceRecord {
        uint256 matchId;
        string  matchName;
        uint256 timestamp;
        uint256 pointsEarned;
    }

    // wallet => Passport
    mapping(address => Passport) public passports;

    // wallet => attendance history
    mapping(address => AttendanceRecord[]) public attendanceHistory;

    // wallet => rewards inbox
    mapping(address => Reward[]) public rewardsInbox;

    // Tier thresholds
    uint256 public constant ROOKIE_THRESHOLD   = 0;
    uint256 public constant FAN_THRESHOLD      = 100;
    uint256 public constant DIEHARD_THRESHOLD  = 300;
    uint256 public constant LEGEND_THRESHOLD   = 700;

    // Points per attendance
    uint256 public constant POINTS_PER_MATCH   = 35;

    // Total passports created
    uint256 public totalPassports;


    // ── Events ───────────────────────────────────────────────────

    event PassportCreated(address indexed wallet, uint256 timestamp);
    event AttendanceLogged(address indexed wallet, uint256 indexed matchId, uint256 pointsEarned);
    event TierUpgraded(address indexed wallet, Tier oldTier, Tier newTier);
    event RewardReceived(address indexed wallet, string sponsor, string description);
    event RewardClaimed(address indexed wallet, uint256 rewardIndex);
    event WalletBlacklisted(address indexed wallet, string reason);
    event WalletCleared(address indexed wallet);
    event ResaleRecorded(address indexed wallet, bool wasClean);


    // ── Constructor ──────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}


    // ── Admin Functions ───────────────────────────────────────────

    function setTicketNFTContract(address _addr) external onlyOwner {
        ticketNFTContract = _addr;
    }

    // PSL blacklists a wallet
    function blacklistWallet(address _wallet, string memory _reason) external onlyOwner {
        require(passports[_wallet].exists, "Passport does not exist");
        passports[_wallet].isBlacklisted = true;
        passports[_wallet].violationCount++;
        emit WalletBlacklisted(_wallet, _reason);
    }

    // PSL clears a blacklisted wallet
    function clearBlacklist(address _wallet) external onlyOwner {
        require(passports[_wallet].exists, "Passport does not exist");
        passports[_wallet].isBlacklisted = false;
        emit WalletCleared(_wallet);
    }

    // PSL pushes sponsor reward to a specific wallet
    function pushReward(
        address _wallet,
        string memory _sponsor,
        string memory _description
    ) external onlyOwner {
        require(passports[_wallet].exists, "Passport does not exist");
        rewardsInbox[_wallet].push(Reward({
            description: _description,
            sponsor:     _sponsor,
            timestamp:   block.timestamp,
            claimed:     false
        }));
        emit RewardReceived(_wallet, _sponsor, _description);
    }

    // PSL pushes reward to ALL fans of a specific tier
    function pushRewardToTier(
        address[] memory _wallets,
        string memory _sponsor,
        string memory _description,
        Tier _minTier
    ) external onlyOwner {
        for (uint256 i = 0; i < _wallets.length; i++) {
            address w = _wallets[i];
            if (
                passports[w].exists &&
                !passports[w].isBlacklisted &&
                uint256(passports[w].currentTier) >= uint256(_minTier)
            ) {
                rewardsInbox[w].push(Reward({
                    description: _description,
                    sponsor:     _sponsor,
                    timestamp:   block.timestamp,
                    claimed:     false
                }));
                emit RewardReceived(w, _sponsor, _description);
            }
        }
    }


    // ── Fan Functions ─────────────────────────────────────────────

    // Fan creates their passport — called automatically on first interaction
    function createPassport() external {
        require(!passports[msg.sender].exists, "Passport already exists");

        passports[msg.sender] = Passport({
            wallet:          msg.sender,
            reputationScore: 0,
            matchesAttended: 0,
            cleanResales:    0,
            violationCount:  0,
            currentTier:     Tier.Rookie,
            isBlacklisted:   false,
            exists:          true
        });

        totalPassports++;
        emit PassportCreated(msg.sender, block.timestamp);
    }

    // Fan claims a reward from inbox
    function claimReward(uint256 _rewardIndex) external {
        require(passports[msg.sender].exists,              "Passport does not exist");
        require(_rewardIndex < rewardsInbox[msg.sender].length, "Reward does not exist");
        require(!rewardsInbox[msg.sender][_rewardIndex].claimed, "Already claimed");

        rewardsInbox[msg.sender][_rewardIndex].claimed = true;
        emit RewardClaimed(msg.sender, _rewardIndex);
    }


    // ── Called by TicketNFT Contract ──────────────────────────────

    // Called when fan's ticket is scanned at gate
    function logAttendance(
        address _fan,
        uint256 _matchId,
        string memory _matchName
    ) external {
        require(
            msg.sender == owner() || msg.sender == ticketNFTContract,
            "Not authorized"
        );

        // Auto create passport if doesn't exist
        if (!passports[_fan].exists) {
            passports[_fan] = Passport({
                wallet:          _fan,
                reputationScore: 0,
                matchesAttended: 0,
                cleanResales:    0,
                violationCount:  0,
                currentTier:     Tier.Rookie,
                isBlacklisted:   false,
                exists:          true
            });
            totalPassports++;
            emit PassportCreated(_fan, block.timestamp);
        }

        require(!passports[_fan].isBlacklisted, "Fan is blacklisted");

        // Add points
        passports[_fan].reputationScore += POINTS_PER_MATCH;
        passports[_fan].matchesAttended++;

        // Record attendance
        attendanceHistory[_fan].push(AttendanceRecord({
            matchId:      _matchId,
            matchName:    _matchName,
            timestamp:    block.timestamp,
            pointsEarned: POINTS_PER_MATCH
        }));

        emit AttendanceLogged(_fan, _matchId, POINTS_PER_MATCH);

        // Check and update tier
        _updateTier(_fan);
    }

    // Called by Marketplace when resale happens
    function recordResale(address _fan, bool _wasClean) external {
        require(
            msg.sender == owner() || msg.sender == ticketNFTContract,
            "Not authorized"
        );
        require(passports[_fan].exists, "Passport does not exist");

        if (_wasClean) {
            passports[_fan].cleanResales++;
            passports[_fan].reputationScore += 10;
        } else {
            passports[_fan].violationCount++;
            if (passports[_fan].reputationScore >= 20) {
                passports[_fan].reputationScore -= 20;
            }
        }

        emit ResaleRecorded(_fan, _wasClean);
        _updateTier(_fan);
    }


    // ── Internal ──────────────────────────────────────────────────

    function _updateTier(address _fan) internal {
        Tier oldTier = passports[_fan].currentTier;
        uint256 score = passports[_fan].reputationScore;
        Tier newTier;

        if (score >= LEGEND_THRESHOLD) {
            newTier = Tier.Legend;
        } else if (score >= DIEHARD_THRESHOLD) {
            newTier = Tier.DieHard;
        } else if (score >= FAN_THRESHOLD) {
            newTier = Tier.Fan;
        } else {
            newTier = Tier.Rookie;
        }

        if (newTier != oldTier) {
            passports[_fan].currentTier = newTier;
            emit TierUpgraded(_fan, oldTier, newTier);
        }
    }


    // ── View Functions ────────────────────────────────────────────

    function getPassport(address _wallet) external view returns (Passport memory) {
        require(passports[_wallet].exists, "Passport does not exist");
        return passports[_wallet];
    }

    function getAttendanceHistory(address _wallet) external view returns (AttendanceRecord[] memory) {
        return attendanceHistory[_wallet];
    }

    function getRewardsInbox(address _wallet) external view returns (Reward[] memory) {
        return rewardsInbox[_wallet];
    }

    function getTierName(address _wallet) external view returns (string memory) {
        require(passports[_wallet].exists, "Passport does not exist");
        Tier t = passports[_wallet].currentTier;
        if (t == Tier.Legend)  return "Legend";
        if (t == Tier.DieHard) return "Die-Hard";
        if (t == Tier.Fan)     return "Fan";
        return "Rookie";
    }

    function isBlacklisted(address _wallet) external view returns (bool) {
        return passports[_wallet].isBlacklisted;
    }

    function hasPassport(address _wallet) external view returns (bool) {
        return passports[_wallet].exists;
    }
}