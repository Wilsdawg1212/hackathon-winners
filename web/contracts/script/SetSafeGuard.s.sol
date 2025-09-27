// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

/**
 * @title SetSafeGuard
 * @dev Script to set the guard on a Safe
 * @notice This script generates the calldata for setting a guard on a Safe
 */
contract SetSafeGuardScript is Script {
    function run() external view {
        address safeAddress = vm.envAddress("SAFE_ADDRESS");
        address guardAddress = vm.envAddress("GUARD_ADDRESS");
        
        console.log("Safe Address:", safeAddress);
        console.log("Guard Address:", guardAddress);
        
        // Generate calldata for setGuard(address guard)
        // This is the GuardManager.setGuard function
        bytes memory calldata = abi.encodeWithSignature("setGuard(address)", guardAddress);
        
        console.log("Calldata for setGuard:");
        console.logBytes(calldata);
        
        console.log("\nTo set the guard, submit a Safe transaction with:");
        console.log("To:", safeAddress);
        console.log("Value: 0");
        console.log("Data:", vm.toString(calldata));
        console.log("\nOr use the frontend to submit this as a Safe transaction.");
    }
}
