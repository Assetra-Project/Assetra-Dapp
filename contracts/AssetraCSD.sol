// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssetraCSD {
    // Possible status values for an asset
    enum Status { Inactive, Active, Matured }

    // Struct to store all metadata of a tokenized asset
    struct TokenizedAsset {
        string name;                // Asset name e.g. "Gov Bond FXD1/2024/10"
        string symbol;             // Short symbol e.g. "FXD24"
        string isin;               // ISIN number (international identifier)
        uint256 totalValue;        // Full value of the asset (KES)
        uint256 fractionCount;     // Number of fractional tokens
        uint256 couponRate;        // In basis points (e.g., 850 = 8.5%)
        uint256 maturityDate;      // Timestamp for maturity
        uint256 outstandingAmount; // Remaining value not yet sold
        address owner;             // Owner or issuer of asset
        Status status;             // Current status of the asset
        bool listed;               // Whether it is listed for trading
    }

    // Asset storage
    mapping(uint256 => TokenizedAsset) public assets;
    uint256 public assetCounter;

    // Events for frontends, mirror node, and dashboards
    event AssetTokenized(uint256 indexed assetId, address indexed owner);
    event AssetListed(uint256 indexed assetId);
    event StatusUpdated(uint256 indexed assetId, Status newStatus);

    // Function to tokenize a new asset
    function tokenizeAsset(
        string memory name,
        string memory symbol,
        string memory isin,
        uint256 totalValue,
        uint256 fractionCount,
        uint256 couponRate,
        uint256 maturityDate,
        uint256 outstandingAmount
    ) public {
        assets[assetCounter] = TokenizedAsset(
            name,
            symbol,
            isin,
            totalValue,
            fractionCount,
            couponRate,
            maturityDate,
            outstandingAmount,
            msg.sender,
            Status.Active,
            false
        );

        emit AssetTokenized(assetCounter, msg.sender);
        assetCounter++;
    }

    // Mark an asset as listed
    function listAsset(uint256 assetId) public {
        require(assets[assetId].owner == msg.sender, "Not the owner");
        assets[assetId].listed = true;
        emit AssetListed(assetId);
    }

    // Update the asset's lifecycle status (e.g., to Matured)
    function updateStatus(uint256 assetId, Status newStatus) public {
        require(assets[assetId].owner == msg.sender, "Not the owner");
        assets[assetId].status = newStatus;
        emit StatusUpdated(assetId, newStatus);
    }

    // Fetch complete asset data (for frontends or dashboards)
    function getAsset(uint256 assetId) public view returns (
        string memory name,
        string memory symbol,
        string memory isin,
        uint256 totalValue,
        uint256 fractionCount,
        uint256 couponRate,
        uint256 maturityDate,
        uint256 outstandingAmount,
        address owner,
        Status status,
        bool listed
    ) {
        TokenizedAsset memory asset = assets[assetId];
        return (
            asset.name,
            asset.symbol,
            asset.isin,
            asset.totalValue,
            asset.fractionCount,
            asset.couponRate,
            asset.maturityDate,
            asset.outstandingAmount,
            asset.owner,
            asset.status,
            asset.listed
        );
    }
}
