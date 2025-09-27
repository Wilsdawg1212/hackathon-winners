// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./GroupOpsPolicy.sol";

/**
 * @title GroupOpsGuard
 * @dev Safe Guard that enforces GroupOpsPolicy rules
 * @notice This guard checks transactions before execution and blocks non-compliant ones
 */
contract GroupOpsGuard {
    GroupOpsPolicy public immutable policy;
    
    event TransactionBlocked(address indexed to, uint256 value, string reason);
    
    constructor(address _policy) {
        policy = GroupOpsPolicy(_policy);
    }
    
    /**
     * @dev Check transaction before execution
     * @param to Destination address
     * @param value ETH value
     * @param data Transaction data
     * @param operation Operation type (0=call, 1=delegatecall)
     * @param safeTxGas Gas for safe transaction
     * @param baseGas Base gas
     * @param gasPrice Gas price
     * @param gasToken Gas token
     * @param refundReceiver Refund receiver
     * @param signatures Signatures
     * @param msgSender Message sender
     */
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external {
        // Check if paused
        if (policy.paused()) {
            emit TransactionBlocked(to, value, "PAUSED");
            revert("PAUSED");
        }
        
        // Handle native ETH transfers
        if (value > 0) {
            (bool allowed, string memory reason) = policy.isAllowed(address(0), to, value);
            if (!allowed) {
                emit TransactionBlocked(to, value, reason);
                revert(reason);
            }
        }
        
        // Handle ERC20 transfers
        if (data.length >= 68) {
            bytes4 selector = bytes4(data);
            
            // Check for transfer(address,uint256) or transferFrom(address,address,uint256)
            if (selector == IERC20.transfer.selector || selector == IERC20.transferFrom.selector) {
                (address token, address recipient, uint256 amount) = _parseTransferData(data, selector);
                
                (bool allowed, string memory reason) = policy.isAllowed(token, recipient, amount);
                if (!allowed) {
                    emit TransactionBlocked(to, value, reason);
                    revert(reason);
                }
            }
        }
    }
    
    /**
     * @dev Check after execution (no-op for MVP)
     */
    function checkAfterExecution(bytes32 txHash, bool success) external {
        // No-op for MVP
    }
    
    /**
     * @dev Parse transfer data to extract token, recipient, and amount
     * @param data Transaction data
     * @param selector Function selector
     * @return token Token address
     * @return recipient Recipient address
     * @return amount Transfer amount
     */
    function _parseTransferData(bytes memory data, bytes4 selector) internal pure returns (address token, address recipient, uint256 amount) {
        if (selector == IERC20.transfer.selector) {
            // transfer(address to, uint256 amount)
            assembly {
                recipient := mload(add(data, 36)) // Skip 4 bytes selector + 32 bytes offset
                amount := mload(add(data, 68))    // Skip 4 bytes selector + 32 bytes offset + 32 bytes recipient
            }
        } else if (selector == IERC20.transferFrom.selector) {
            // transferFrom(address from, address to, uint256 amount)
            assembly {
                recipient := mload(add(data, 68))  // Skip 4 bytes selector + 32 bytes offset + 32 bytes from
                amount := mload(add(data, 100))   // Skip 4 bytes selector + 32 bytes offset + 32 bytes from + 32 bytes to
            }
        }
        
        // The token address is the contract being called (to address)
        // This will be set by the caller
    }
}

// Enum for operation types
library Enum {
    enum Operation { Call, DelegateCall }
}
