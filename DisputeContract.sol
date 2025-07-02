// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisputeContract {
    enum DisputeStatus { Open, Resolved, Rejected }

    struct Dispute {
        uint id;
        uint leaseId;
        address user;
        string disputeType;
        string description;
        uint timestamp;
        DisputeStatus status;
    }

    uint public disputeCounter;
    mapping(uint => Dispute) public disputes;
    mapping(address => uint[]) public userDisputes;

    event DisputeFiled(uint disputeId, uint leaseId, address indexed user);

    function fileDispute(uint _leaseId, string memory _type, string memory _desc) external {
        disputeCounter++;
        disputes[disputeCounter] = Dispute(disputeCounter, _leaseId, msg.sender, _type, _desc, block.timestamp, DisputeStatus.Open);
        userDisputes[msg.sender].push(disputeCounter);
        emit DisputeFiled(disputeCounter, _leaseId, msg.sender);
    }

    function resolveDispute(uint _disputeId, bool _accept) external {
        // Add admin check for production
        disputes[_disputeId].status = _accept ? DisputeStatus.Resolved : DisputeStatus.Rejected;
    }

    function getUserDisputes(address _user) external view returns (uint[] memory) {
        return userDisputes[_user];
    }
}
