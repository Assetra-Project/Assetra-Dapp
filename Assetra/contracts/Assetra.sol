//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC1400 Implementation embedded directly in the contract
contract Assetra is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ERC1400 basic properties
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    address[] private _controllers;
    
    // ERC1400 Events
    event Issued(address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData);
    event Redeemed(address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData);
    event TransferWithData(address indexed operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData);
    
    // Enum Definitions
    enum CouponType { Fixed, Floating, Zero, VariableRate }
    enum RegulationType { Regulation_D, Regulation_S, Regulation_A, RegulationCF }
    enum BondStatus { Configured, Issued, Active, Matured, Redeemed }

    // Bond Configuration Struct
    struct BondDetails {
        // string name;
        // string symbol;
        string isin;
        // uint8 decimals;
        // string currency;
        uint256 numberOfBondUnits;
        uint256 nominalValue;
        uint256 totalValue;
        uint256 investmentAmount;
        uint256 fractionalDenomination; // Fractional partitioning
        // uint256 partitionPrice; // Partition price field
        uint256 startDate;
        uint256 maturityDate;
        // CouponType couponType;
        // uint256 couponRate;
        // uint256 couponFrequency;
        // RegulationType regulationType;
        BondStatus status;
        uint256 tokensIssued;
    }

    // Mappings
    mapping(address => BondDetails) public bondRegistry;
    mapping(string => bool) public isinRegistry;
    mapping(address => mapping(string => uint256)) public investorBondHoldings;

    // Payment token for bond purchases
    IERC20 public paymentToken;

    // Events
    event BondConfigured(
        address indexed issuer, 
        string name, 
        string symbol, 
        string isin
    );
    event BondTokenized(
        address indexed issuer, 
        string isin, 
        uint256 tokensIssued
    );
    event BondPurchased(
        address indexed investor, 
        string isin, 
        uint256 amount,
        bool isFractional
    );
    // event CouponPaid(
    //     address indexed investor, 
    //     string isin, 
    //     uint256 couponAmount
    // );
   


    // Constructor
    constructor() Ownable(msg.sender){
        
    }
    
    // ERC1400 implementation functions
    
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function _mint(address account, uint256 amount, bytes memory data, bytes memory operatorData) internal {
        require(account != address(0), "ERC1400: mint to the zero address");
        
        _totalSupply += amount;
        _balances[account] += amount;
        
        emit Issued(msg.sender, account, amount, data, operatorData);
    }
    
    function _transfer(address recipient, uint256 amount) internal {
        require(recipient != address(0), "ERC1400: transfer to the zero address");
        
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        
        bytes memory emptyBytes = "";
        emit TransferWithData(msg.sender, msg.sender, recipient, amount, emptyBytes, emptyBytes);
    }
    
    // function isController(address controller) public view returns (bool) {
    //     for (uint256 i = 0; i < _controllers.length; i++) {
    //         if (_controllers[i] == controller) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // Comprehensive Bond Configuration Function
    function configureBond(
        // string memory _Tokenname,
        // string memory _Tokensymbol,
        string memory _isin,
        // uint8 _decimals,
        // string memory _currency,
        uint256 _numberOfBondUnits,
        uint256 _nominalValue,
        uint256 _totalValue,
        uint256 _investmentAmount,
        uint256 _fractionalDenomination,
        // uint256 _partitionPrice,
        uint256 _startDate,
        uint256 _maturityDate
        // CouponType _couponType,
        // uint256 _couponRate,
        // uint256 _couponFrequency,
        // RegulationType _regulationType
    ) public onlyOwner {
        // Validation checks
        require(bytes(_isin).length == 12, "Invalid ISIN length");
        require(!isinRegistry[_isin], "ISIN already exists");
        require(_numberOfBondUnits > 0, "Invalid number of bond units");
        require(_nominalValue > 0, "Invalid nominal value");
        require(_totalValue > 0, "Invalid total value");
        require(_startDate < _maturityDate, "Invalid date range");
        require(
            _totalValue == _numberOfBondUnits * _nominalValue, 
            "Total value must equal units * nominal value"
        );
        // Fractional denomination validation
        require(_fractionalDenomination > 0, "Fractional denomination must be positive");
        require(
            _investmentAmount > _fractionalDenomination, 
            "Minimum investment must be at least fractional denomination"
        );

        // Partition price validation
        
        require(
            _investmentAmount < _fractionalDenomination * 115 / 100, 
            "Partition price must be less than 15% above fractional denomination"
        );

        // ISIN country code validation
        bytes memory isinBytes = bytes(_isin);
        require(
            (isinBytes[0] >= 'A' && isinBytes[0] <= 'Z') && 
            (isinBytes[1] >= 'A' && isinBytes[1] <= 'Z'),
            "Invalid ISIN country code"
        );

        // Store bond details
        BondDetails storage bond = bondRegistry[msg.sender];
        
        // bond.name = _Tokenname;
        // bond.symbol = _Tokensymbol;
        bond.isin = _isin;
        // bond.decimals = _decimals;
        // bond.currency = _currency;
        bond.numberOfBondUnits = _numberOfBondUnits;
        bond.nominalValue = _nominalValue;
        bond.totalValue = _totalValue;
        bond.investmentAmount = _investmentAmount;
        bond.fractionalDenomination = _fractionalDenomination;
        bond.startDate = _startDate;
        bond.maturityDate = _maturityDate;
        // bond.couponType = _couponType;
        // bond.couponRate = _couponRate;
        // bond.couponFrequency = _couponFrequency;
        // bond.regulationType = _regulationType;
        bond.status = BondStatus.Configured;
        bond.tokensIssued = 0;

        // Mark ISIN as used
        isinRegistry[_isin] = true;

        emit BondConfigured(msg.sender, _name, _symbol, _isin);
    }

    // Tokenize Bond Function
    function tokenizeBond(string memory _isin, uint256 _tokensToIssue) public onlyOwner {
        BondDetails storage bond = bondRegistry[msg.sender];
        
        require(
            keccak256(abi.encodePacked(bond.isin)) == keccak256(abi.encodePacked(_isin)), 
            "Invalid ISIN"
        );
        require(bond.status == BondStatus.Configured, "Bond not in configurable state");
        require(_tokensToIssue <= bond.numberOfBondUnits, "Cannot issue more tokens than bond units");

        // Update bond status and tokens issued
        bond.status = BondStatus.Issued;
        bond.tokensIssued = _tokensToIssue;

        // Mint tokens using ERC1400 functionality
        _mint(msg.sender, _tokensToIssue, "", "");

        emit BondTokenized(msg.sender, _isin, _tokensToIssue);
    }

    // Purchase Bond Tokens Function
    function purchaseBondTokens(
        string memory _isin,
        uint256 _amount
    ) public payable{
        BondDetails storage bond = bondRegistry[msg.sender];
        
        require(
            keccak256(abi.encodePacked(bond.isin)) == keccak256(abi.encodePacked(_isin)), 
            "Invalid ISIN"
        );
        require(bond.status == BondStatus.Issued, "Bond not available for purchase");
        
        // Fractional purchase validation
        require(_amount >= bond.fractionalDenomination, "Amount below fractional denomination");
        require(
            _amount % bond.fractionalDenomination == 0, 
            "Purchase amount must be a multiple of fractional denomination"
        );
        require(_amount <= bond.tokensIssued, "Insufficient tokens available");

        // Calculate total payment amount
        uint256 totalPayment = _amount * bond.investmentAmount;
        // Require sufficient payment
        require(msg.value >= totalPayment, "Insufficient payment amount");    

        // Transfer payment tokens from investor
        require(
            paymentToken.transferFrom(msg.sender, address(this), totalPayment), 
            "Payment transfer failed"
        );

        // Transfer bond tokens to investor
        _transfer(msg.sender, msg.value);

        // Update investor holdings
        investorBondHoldings[msg.sender][_isin] += msg.value;

        emit BondPurchased(msg.sender, _isin, msg.value, true);
    }

    

    // Helper function to get bond details
    function getBondDetails() public view returns (BondDetails memory) {
        return bondRegistry[msg.sender];
    }

    // Placeholder for getting bondholders (would need more robust implementation)
    function getHolders() internal view returns (address[] memory) {
        // This is a simplified placeholder. In a real implementation, 
        // you'd need a more sophisticated way to track all token holders
        address[] memory holders = new address[](1);
        holders[0] = msg.sender;
        return holders;
    }
}