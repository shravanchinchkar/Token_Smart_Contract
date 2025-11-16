// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenContract {
    string public name = "ShravanToken";
    string public symbol = "Shrav";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * (10 ** uint256(decimals));

    // following are the two objects.
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Define the evnets the contract will throw
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor() {
        balanceOf[msg.sender] = totalSupply; // here initially the total supply will go to the person who deployed the contract. Means all the supply will be minted to the person who deployed the contract. 
    }

    // The following function is called when we want to send the token to anyone else
    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        /*
        if (!allowedAmount || allowedAmount < amount) {
            return res.status(400).send("Insufficient allowance!");
        }
        if (balances[fromUserId] < amount) {
            return res.status(400).send("Insufficient funds!");
        }

        the below require logic is similar to the above if conditions
        */
        require(_value <= balanceOf[_from], "Not enough balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        /*
        balances[fromUserId] -= amount;
        balances[toUserId] += amount;
        allowances[fromUserId][spenderId] -= amount; 

        the below 3 lines logic is similar to the above 
        */

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
