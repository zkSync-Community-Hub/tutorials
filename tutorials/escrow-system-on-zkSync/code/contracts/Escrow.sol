// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    address public purchaser;
    address public vendor;
    address public intermediary;
    uint256 public totalAmount;
    bool public isFunded;
    bool public isFinished;
    uint8 totalAgreements;

    event DepositMade(address indexed depositor, uint256 amount);
    event PaymentReleased(address indexed recipient, uint256 amount); 
    event EscrowClosed();

    mapping(uint256 => Agreement) public agreements;

    modifier onlyPurchaser() {
        require(msg.sender == purchaser, "Only the purchaser can call this function");
        _;
    }

    modifier onlyVendor() {
        require(msg.sender == vendor, "Only the vendor can call this function");
        _;
    }

    modifier onlyIntermediary() {
        require(msg.sender == intermediary, "Only the intermediary can call this function");
        _;
    }

    modifier onlyPurchaserOrIntermediary() {
        require(msg.sender == purchaser || msg.sender == intermediary, "Only the purchaser or intermediary can call this function");
        _;
    }

    modifier onlyNotFinished() {
        require(!isFinished, "Escrow has already been completed");
        _;
    }

    struct Agreement{
        string title;
        string description;
        uint256 amount;
        address purchaser;
        address vendor;
    }

    constructor() {
        intermediary = msg.sender;
    }

    function createAgreement(string memory _title, string memory _description, uint256 _amount) external onlyVendor{
        totalAgreements++;
        uint8 agreementId = totalAgreements;
        agreements[agreementId] = Agreement(_title,_description,_amount,address(0),msg.sender);

    }

    function enterAgreement(uint8 _agreementId) external onlyPurchaser{
        require(_agreementId <= totalAgreements && _agreementId > 0, "agreement not found");
        Agreement storage agreement = agreements[_agreementId]; 
        agreement.purchaser = msg.sender;
    }

    function registerPurchaser() external onlyNotFinished {
        require(purchaser == address(0), "Purchaser already registered");
        require(msg.sender != vendor, "Address is already registered as a vendor");
        purchaser = msg.sender;
    }
 
    function registerVendor() external onlyNotFinished {
        require(vendor == address(0), "Vendor already registered");
        require(msg.sender != purchaser, "Address is already registered as a purchaser");
        vendor = msg.sender;
    }

    function depositFunds(uint8 _agreementId) external onlyPurchaser payable onlyNotFinished {
        require(!isFunded, "Funds have already been deposited");
        require(_agreementId <= totalAgreements && _agreementId > 0, "agreement not found");
        Agreement storage agreement = agreements[_agreementId];
        uint budgetedAmount = agreement.amount;
        require(msg.value >= budgetedAmount, "Invalid deposit amount");
        totalAmount += msg.value;
        isFunded = true;
        emit DepositMade(purchaser, totalAmount);
    }

    function releasePayment(uint8 _agreementId) external onlyIntermediary onlyNotFinished payable  {
        require(isFunded, "Funds must be deposited before releasing");
        require(_agreementId <= totalAgreements && _agreementId > 0, "agreement not found");
        Agreement storage agreement = agreements[_agreementId];
        uint amount = agreement.amount;
        (bool success, ) = vendor.call{value :amount}("");
        require(success, "Transfer to vendor failed");
        isFunded = false;
        isFinished = true;
        emit PaymentReleased(vendor, totalAmount);
        emit EscrowClosed();
    }

    function refundPayment(uint8 _agreementId) external onlyPurchaserOrIntermediary onlyNotFinished {
        require(isFunded, "Funds must be deposited before refunding");
        require(_agreementId <= totalAgreements && _agreementId > 0, "agreement not found");
        Agreement storage agreement = agreements[_agreementId];
        uint amount = agreement.amount;
        (bool success,) = purchaser.call{value : amount}("");
        require(success , "Refund failed to purchaser");
        isFunded = false;
        isFinished = true;
        emit PaymentReleased(purchaser, totalAmount);
        emit EscrowClosed();
    }

}