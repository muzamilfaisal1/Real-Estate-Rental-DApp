// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyOwnership {
    struct Property {
        uint id;
        address owner;
        string location;
        string propertyType;
        uint size;
        uint bedrooms;
        uint bathrooms;
    }

    uint public propertyCounter;
    mapping(uint => Property) public properties;
    mapping(address => uint[]) public userProperties;

    event PropertyRegistered(uint id, address indexed owner);

    function registerProperty(
        string memory _location,
        string memory _type,
        uint _size,
        uint _bedrooms,
        uint _bathrooms
    ) external {
        propertyCounter++;
        properties[propertyCounter] = Property(propertyCounter, msg.sender, _location, _type, _size, _bedrooms, _bathrooms);
        userProperties[msg.sender].push(propertyCounter);
        emit PropertyRegistered(propertyCounter, msg.sender);
    }

    function getUserProperties(address _user) external view returns (uint[] memory) {
        return userProperties[_user];
    }
}
