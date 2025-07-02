// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LeaseContract {
    struct Lease {
        uint id;
        address landlord;
        address tenant;
        uint startDate;
        uint duration; // months
        uint rent;
        uint deposit;
        bool active;
    }

    uint public leaseCounter;
    mapping(uint => Lease) public leases;
    mapping(address => uint[]) public userLeases;

    event LeaseCreated(uint leaseId, address indexed landlord, address indexed tenant);
    event LeaseTerminated(uint leaseId);

    function createLease(address _tenant, uint _startDate, uint _duration, uint _rent, uint _deposit) external {
        leaseCounter++;
        leases[leaseCounter] = Lease(leaseCounter, msg.sender, _tenant, _startDate, _duration, _rent, _deposit, true);
        userLeases[msg.sender].push(leaseCounter);
        userLeases[_tenant].push(leaseCounter);
        emit LeaseCreated(leaseCounter, msg.sender, _tenant);
    }

    function terminateLease(uint _leaseId) external {
        Lease storage lease = leases[_leaseId];
        require(msg.sender == lease.landlord || msg.sender == lease.tenant, "Not authorized");
        lease.active = false;
        emit LeaseTerminated(_leaseId);
    }

    function getLeasesByUser(address _user) external view returns (uint[] memory) {
        return userLeases[_user];
    }
}
