// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PaymentContract
 * @dev Smart contract for managing rent payments on the Havenly platform
 */
contract PaymentContract {
    // State variables
    address public owner;
    uint256 public platformFeePercentage; // Fee percentage (e.g., 1 = 1%)
    uint256 public paymentCounter;
    
    // Interface for LeaseContract
    interface ILeaseContract {
        function getLeaseDetails(uint256 _leaseId) external view returns (
            address landlord,
            address tenant,
            uint256 propertyId,
            uint256 startDate,
            uint256 endDate,
            uint256 monthlyRent,
            uint256 securityDeposit,
            uint8 status,
            bool securityDepositReturned
        );
    }
    
    // Reference to the LeaseContract
    ILeaseContract public leaseContract;
    
    // Payment status enum
    enum PaymentStatus { Pending, Completed, Late, Refunded }
    
    // Payment structure
    struct Payment {
        uint256 id;
        uint256 leaseId;
        address tenant;
        address landlord;
        uint256 amount;
        uint256 dueDate;
        uint256 paidDate;
        uint256 platformFee;
        PaymentStatus status;
        string paymentPeriod; // e.g., "2023-05" for May 2023
    }
    
    // Mapping from payment ID to Payment struct
    mapping(uint256 => Payment) public payments;
    
    // Mapping from lease ID to array of payment IDs
    mapping(uint256 => uint256[]) public leasePayments;
    
    // Mapping from address to array of payment IDs (for both landlords and tenants)
    mapping(address => uint256[]) public landlordPayments;
    mapping(address => uint256[]) public tenantPayments;
    
    // Events
    event PaymentCreated(
        uint256 indexed paymentId,
        uint256 indexed leaseId,
        address indexed tenant,
        uint256 amount,
        uint256 dueDate,
        string paymentPeriod
    );
    
    event PaymentCompleted(
        uint256 indexed paymentId,
        uint256 indexed leaseId,
        address indexed tenant,
        uint256 amount,
        uint256 paidDate,
        uint256 platformFee
    );
    
    event PaymentRefunded(
        uint256 indexed paymentId,
        uint256 indexed leaseId,
        address indexed tenant,
        uint256 amount,
        uint256 refundDate
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyLandlord(uint256 _paymentId) {
        require(payments[_paymentId].landlord == msg.sender, "Only landlord can call this function");
        _;
    }
    
    modifier onlyTenant(uint256 _paymentId) {
        require(payments[_paymentId].tenant == msg.sender, "Only tenant can call this function");
        _;
    }
    
    modifier paymentExists(uint256 _paymentId) {
        require(_paymentId <= paymentCounter && _paymentId > 0, "Payment does not exist");
        _;
    }
    
    // Constructor
    constructor(address _leaseContractAddress, uint256 _platformFeePercentage) {
        owner = msg.sender;
        leaseContract = ILeaseContract(_leaseContractAddress);
        platformFeePercentage = _platformFeePercentage;
        paymentCounter = 0;
    }
    
    /**
     * @dev Create a new payment request
     * @param _leaseId ID of the lease
     * @param _dueDate Due date for the payment (Unix timestamp)
     * @param _paymentPeriod String representation of the payment period (e.g., "2023-05")
     * @return paymentId The ID of the newly created payment
     */
    function createPaymentRequest(
        uint256 _leaseId,
        uint256 _dueDate,
        string memory _paymentPeriod
    ) external returns (uint256) {
        // Get lease details
        (
            address landlord,
            address tenant,
            ,
            ,
            ,
            uint256 monthlyRent,
            ,
            uint8 status,
            
        ) = leaseContract.getLeaseDetails(_leaseId);
        
        // Validate lease
        require(status == 0, "Lease is not active"); // 0 = Active in LeaseStatus enum
        require(msg.sender == landlord, "Only landlord can create payment requests");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        
        // Increment payment counter
        paymentCounter++;
        
        // Create new payment
        Payment memory newPayment = Payment({
            id: paymentCounter,
            leaseId: _leaseId,
            tenant: tenant,
            landlord: landlord,
            amount: monthlyRent,
            dueDate: _dueDate,
            paidDate: 0,
            platformFee: 0,
            status: PaymentStatus.Pending,
            paymentPeriod: _paymentPeriod
        });
        
        // Store payment
        payments[paymentCounter] = newPayment;
        
        // Update mappings
        leasePayments[_leaseId].push(paymentCounter);
        landlordPayments[landlord].push(paymentCounter);
        tenantPayments[tenant].push(paymentCounter);
        
        // Emit event
        emit PaymentCreated(
            paymentCounter,
            _leaseId,
            tenant,
            monthlyRent,
            _dueDate,
            _paymentPeriod
        );
        
        return paymentCounter;
    }
    
    /**
     * @dev Make a rent payment
     * @param _paymentId ID of the payment
     */
    function makePayment(
        uint256 _paymentId
    ) external payable paymentExists(_paymentId) {
        Payment storage payment = payments[_paymentId];
        
        // Validate payment
        require(payment.status == PaymentStatus.Pending, "Payment is not pending");
        require(payment.tenant == msg.sender, "Only tenant can make this payment");
        require(msg.value == payment.amount, "Payment amount mismatch");
        
        // Calculate platform fee
        uint256 platformFee = (payment.amount * platformFeePercentage) / 100;
        uint256 landlordAmount = payment.amount - platformFee;
        
        // Update payment
        payment.status = PaymentStatus.Completed;
        payment.paidDate = block.timestamp;
        payment.platformFee = platformFee;
        
        // Transfer funds to landlord
        (bool successLandlord, ) = payment.landlord.call{value: landlordAmount}("");
        require(successLandlord, "Transfer to landlord failed");
        
        // Transfer platform fee to contract owner
        (bool successOwner, ) = owner.call{value: platformFee}("");
        require(successOwner, "Transfer of platform fee failed");
        
        // Emit event
        emit PaymentCompleted(
            _paymentId,
            payment.leaseId,
            msg.sender,
            payment.amount,
            block.timestamp,
            platformFee
        );
    }
    
    /**
     * @dev Refund a payment (only landlord or owner)
     * @param _paymentId ID of the payment
     */
    function refundPayment(
        uint256 _paymentId
    ) external payable paymentExists(_paymentId) {
        Payment storage payment = payments[_paymentId];
        
        // Validate payment
        require(
            payment.status == PaymentStatus.Completed,
            "Payment must be completed to be refunded"
        );
        require(
            msg.sender == payment.landlord || msg.sender == owner,
            "Only landlord or owner can refund"
        );
        require(
            msg.value == payment.amount - payment.platformFee,
            "Refund amount mismatch"
        );
        
        // Update payment
        payment.status = PaymentStatus.Refunded;
        
        // Transfer refund to tenant
        (bool success, ) = payment.tenant.call{value: msg.value}("");
        require(success, "Refund transfer failed");
        
        // Emit event
        emit PaymentRefunded(
            _paymentId,
            payment.leaseId,
            payment.tenant,
            msg.value,
            block.timestamp
        );
    }
    
    /**
     * @dev Get all payments for a lease
     * @param _leaseId ID of the lease
     * @return Array of payment IDs
     */
    function getLeasePayments(uint256 _leaseId) external view returns (uint256[] memory) {
        return leasePayments[_leaseId];
    }
    
    /**
     * @dev Get all payments for a landlord
     * @param _landlord Address of the landlord
     * @return Array of payment IDs
     */
    function getLandlordPayments(address _landlord) external view returns (uint256[] memory) {
        return landlordPayments[_landlord];
    }
    
    /**
     * @dev Get all payments for a tenant
     * @param _tenant Address of the tenant
     * @return Array of payment IDs
     */
    function getTenantPayments(address _tenant) external view returns (uint256[] memory) {
        return tenantPayments[_tenant];
    }
    
    /**
     * @dev Get payment details
     * @param _paymentId ID of the payment
     * @return Payment details
     */
    function getPaymentDetails(uint256 _paymentId) external view paymentExists(_paymentId) returns (
        uint256 leaseId,
        address tenant,
        address landlord,
        uint256 amount,
        uint256 dueDate,
        uint256 paidDate,
        uint256 platformFee,
        PaymentStatus status,
        string memory paymentPeriod
    ) {
        Payment memory payment = payments[_paymentId];
        return (
            payment.leaseId,
            payment.tenant,
            payment.landlord,
            payment.amount,
            payment.dueDate,
            payment.paidDate,
            payment.platformFee,
            payment.status,
            payment.paymentPeriod
        );
    }
    
    /**
     * @dev Update lease contract address (only owner)
     * @param _newLeaseContractAddress Address of the new lease contract
     */
    function updateLeaseContractAddress(address _newLeaseContractAddress) external onlyOwner {
        require(_newLeaseContractAddress != address(0), "Invalid lease contract address");
        leaseContract = ILeaseContract(_newLeaseContractAddress);
    }
    
    /**
     * @dev Update platform fee percentage (only owner)
     * @param _newFeePercentage New fee percentage
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 10, "Fee percentage cannot exceed 10%");
        platformFeePercentage = _newFeePercentage;
    }
    
    /**
     * @dev Transfer contract ownership (only owner)
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid owner address");
        owner = _newOwner;
    }
}