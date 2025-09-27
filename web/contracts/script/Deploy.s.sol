// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/GroupOpsPolicy.sol";
import "../src/GroupOpsGuard.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy GroupOpsPolicy
        GroupOpsPolicy policy = new GroupOpsPolicy();
        console.log("GroupOpsPolicy deployed at:", address(policy));
        
        // Deploy GroupOpsGuard with policy address
        GroupOpsGuard guard = new GroupOpsGuard(address(policy));
        console.log("GroupOpsGuard deployed at:", address(guard));
        
        vm.stopBroadcast();
        
        // Write addresses to file for frontend
        string memory addressesJson = string(abi.encodePacked(
            '{\n',
            '  "policy": "', vm.toString(address(policy)), '",\n',
            '  "guard": "', vm.toString(address(guard)), '"\n',
            '}'
        ));
        
        vm.writeFile("addresses.json", addressesJson);
        console.log("Addresses written to addresses.json");
    }
}
