// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MaintenanceContract {
    enum Urgency { Low, Medium, High, Emergency }

    struct Request {
        uint id;
        uint leaseId;
        address requester;
        string requestType;
        Urgency urgency;
        string description;
        uint timestamp;
    }

    uint public requestCounter;
    mapping(uint => Request[]) public leaseRequests;
    mapping(address => uint[]) public userRequests;

    event MaintenanceRequested(uint requestId, uint leaseId, address requester);

    function requestMaintenance(
        uint _leaseId,
        string memory _type,
        Urgency _urgency,
        string memory _desc
    ) external {
        requestCounter++;
        Request memory newRequest = Request({
            id: requestCounter,
            leaseId: _leaseId,
            requester: msg.sender,
            requestType: _type,
            urgency: _urgency,
            description: _desc,
            timestamp: block.timestamp
        });

        leaseRequests[_leaseId].push(newRequest);
        userRequests[msg.sender].push(requestCounter);

        emit MaintenanceRequested(requestCounter, _leaseId, msg.sender);
    }

    function getLeaseRequests(uint _leaseId) external view returns (Request[] memory) {
        return leaseRequests[_leaseId];
    }

    function getUserRequests(address _user) external view returns (uint[] memory) {
        return userRequests[_user];
    }
}
