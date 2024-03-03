// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract TestamentManager {

    uint public testamentCount;
    address public hospitalAddress = 0xCded5607C0cBD892BDdef4817c8Bc0C1505C67F1; 

    struct Testament {
        uint256 totalAmount;
        mapping(address => uint256) addressPercentages;
        address payable [] recipients;
        bool active;
    }

    mapping(address => Testament) testaments;

    function writeTestament(address payable[] memory recipients, uint256[] memory percentages) external payable {
        require(recipients.length == percentages.length, "Length of recipients and percentages arrays must be the same.");
        uint256 totalPercentage = 0;
        testaments[msg.sender].recipients = recipients;
        testaments[msg.sender].totalAmount = msg.value;
        for (uint256 i = 0; i < recipients.length; i++) {
            address payable recipient = recipients[i];
            uint256 percentage = percentages[i];
            testaments[msg.sender].addressPercentages[recipient] = percentage;
            totalPercentage += percentage;
        }
        require(totalPercentage == 100, "Total percentage must be 100.");
    }

    function getAddressAndPercentages(address owner) private view returns (uint256[] memory) {
        address payable [] memory addresses = testaments[owner].recipients;

        uint[] memory percentages = new uint[](addresses.length);
        
        for (uint i = 0; i < addresses.length; i++) {
            percentages[i] = testaments[owner].addressPercentages[addresses[i]];
        }
        
        return percentages;
    }

    function getTestament() public view returns (uint256, address payable [] memory, uint[] memory) {
        address payable[] memory recipients = testaments[msg.sender].recipients;
        uint[] memory percentages = getAddressAndPercentages(msg.sender);
        return (testaments[msg.sender].totalAmount, recipients, percentages);
    }

    function distribute(address owner) public {
        require(msg.sender == owner || msg.sender == hospitalAddress, "Only the testament owner and Hospital can call this function");
        address payable [] memory recipients = testaments[owner].recipients;
        uint totalAmount = testaments[owner].totalAmount;

        for (uint i = 0; i < recipients.length; i++) {
            uint percentage = testaments[owner].addressPercentages[recipients[i]];
            uint amount = (totalAmount*percentage)/100;
            recipients[i].transfer(amount);
        }
        testaments[owner].totalAmount = 0;
        deleteTestament(owner);
    }

    function cancelTestamnet(address owner) public {
        require(msg.sender == owner, "Only the testament owner can call this function");
        deleteTestament(owner);
    }

    function deleteTestament(address owner) private {
        uint256 remainingFunds = testaments[owner].totalAmount;
        address payable testator = payable(owner);
        testator.transfer(remainingFunds);
        
        delete testaments[owner];
    }

}