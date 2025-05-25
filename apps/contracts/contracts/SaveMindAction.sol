// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SaveMindAction {
    // Event to emit when a healthy action is recorded
    event ActionSaved(
        address indexed to,
        uint256 timestamp,
        uint256 value,
        string action,
        string message
    );

    // Mind Action struct
    struct MindAction {
        address to;
        uint256 timestamp;
        uint256 value;
        string action;  //meditate, paint, walk, sleep etc
        string message;
    }

    // Address of contract deployer
    address owner;

    // List of all money actions
    MindAction[] mindActions;

    constructor() {
        owner = msg.sender;
    }

    /**
    * This function allows the contract to receive VET from the owner
    */
    receive() external payable {}

    /**
    * This function is used to fund the contract, This can be done only by the owner.
    */
    function fundContract() external payable onlyOwner {}

    /**
    * Modifier to restrict functions to the owner
    */ 
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized, Only the owner can fund the contract");
        _;
    }

    /**
     * @dev fetches all stored mindActions
     */
    function getMindActions() public view returns (MindAction[] memory) {
        return mindActions;
    }

    /**
     * @dev record an action
     * @param _action is the type of action
     * @param _message a nice message to remember the action
     */
    function saveAction(string memory _action, string memory _message) public payable {      
        uint256 reward = 1 ether; // 1 VET = 1e18 Wei

        // Add the sale to storage
        mindActions.push(MindAction(
            owner,
            block.timestamp,
            reward,
            _action,
            _message
        ));

        // Send the VET to the user
        require(address(this).balance >= reward, "Not enough funds in contract");
        (bool sent, ) = payable(msg.sender).call{value: reward}("");
        require(sent, "Reward transfer failed");

        emit ActionSaved(
            msg.sender,
            block.timestamp,
            reward,
            _action,
            _message
        );
    }
}
