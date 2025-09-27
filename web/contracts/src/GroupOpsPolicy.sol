// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GroupOpsPolicy
 * @dev Policy contract that defines rules for group operations
 * @notice This contract is owned by a Gnosis Safe and defines policies for transfers
 */
contract GroupOpsPolicy is Ownable {
    bool public paused;
    
    mapping(address => bool) public allowedRecipient;
    mapping(address => uint256) public maxPerTx; // token => max amount (token=address(0) for native)
    
    event PausedSet(bool paused);
    event AllowedRecipientSet(address indexed recipient, bool allowed);
    event MaxPerTxSet(address indexed token, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Set the paused state
     * @param _paused Whether operations are paused
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedSet(_paused);
    }
    
    /**
     * @dev Set whether a recipient is allowed
     * @param to The recipient address
     * @param allowed Whether the recipient is allowed
     */
    function setAllowedRecipient(address to, bool allowed) external onlyOwner {
        allowedRecipient[to] = allowed;
        emit AllowedRecipientSet(to, allowed);
    }
    
    /**
     * @dev Set the maximum amount per transaction for a token
     * @param token The token address (address(0) for native ETH)
     * @param amount The maximum amount per transaction
     */
    function setMaxPerTx(address token, uint256 amount) external onlyOwner {
        maxPerTx[token] = amount;
        emit MaxPerTxSet(token, amount);
    }
    
    /**
     * @dev Check if a transfer is allowed according to the policy
     * @param token The token address (address(0) for native ETH)
     * @param to The recipient address
     * @param amount The transfer amount
     * @return allowed Whether the transfer is allowed
     * @return reason The reason if not allowed
     */
    function isAllowed(address token, address to, uint256 amount) external view returns (bool allowed, string memory reason) {
        if (paused) {
            return (false, "PAUSED");
        }
        
        if (!allowedRecipient[to]) {
            return (false, "DISALLOWED_RECIPIENT");
        }
        
        if (amount > maxPerTx[token]) {
            return (false, "EXCEEDS_MAX_PER_TX");
        }
        
        return (true, "");
    }
    
    /**
     * @dev Get the current policy summary
     * @return _paused Whether operations are paused
     * @return _maxPerTxNative Maximum per transaction for native ETH
     * @return _maxPerTxUSDC Maximum per transaction for USDC (if set)
     * @return _allowedRecipientsCount Number of allowed recipients
     */
    function getPolicySummary() external view returns (
        bool _paused,
        uint256 _maxPerTxNative,
        uint256 _maxPerTxUSDC,
        uint256 _allowedRecipientsCount
    ) {
        _paused = paused;
        _maxPerTxNative = maxPerTx[address(0)];
        _maxPerTxUSDC = maxPerTx[0xA0b86a33E6441b8c4C8C0E1234567890AbCdEf12]; // Placeholder USDC address
        _allowedRecipientsCount = 0; // This would need to be tracked separately for efficiency
    }
}
