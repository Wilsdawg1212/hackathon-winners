// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/GroupOpsPolicy.sol";
import "../src/GroupOpsGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract GroupOpsTest is Test {
    GroupOpsPolicy public policy;
    GroupOpsGuard public guard;
    MockERC20 public token;
    
    address public owner = address(0x1);
    address public recipient1 = address(0x2);
    address public recipient2 = address(0x3);
    address public nonOwner = address(0x4);
    
    function setUp() public {
        vm.startPrank(owner);
        policy = new GroupOpsPolicy();
        guard = new GroupOpsGuard(address(policy));
        token = new MockERC20("Test Token", "TEST");
        vm.stopPrank();
    }
    
    function testInitialState() public {
        assertFalse(policy.paused());
        assertFalse(policy.allowedRecipient(recipient1));
        assertEq(policy.maxPerTx(address(0)), 0);
    }
    
    function testSetPaused() public {
        vm.prank(owner);
        policy.setPaused(true);
        assertTrue(policy.paused());
        
        vm.prank(owner);
        policy.setPaused(false);
        assertFalse(policy.paused());
    }
    
    function testSetPausedOnlyOwner() public {
        vm.prank(nonOwner);
        vm.expectRevert();
        policy.setPaused(true);
    }
    
    function testSetAllowedRecipient() public {
        vm.prank(owner);
        policy.setAllowedRecipient(recipient1, true);
        assertTrue(policy.allowedRecipient(recipient1));
        
        vm.prank(owner);
        policy.setAllowedRecipient(recipient1, false);
        assertFalse(policy.allowedRecipient(recipient1));
    }
    
    function testSetMaxPerTx() public {
        uint256 maxAmount = 1000 * 10**18;
        
        vm.prank(owner);
        policy.setMaxPerTx(address(token), maxAmount);
        assertEq(policy.maxPerTx(address(token)), maxAmount);
        
        vm.prank(owner);
        policy.setMaxPerTx(address(0), 1 ether);
        assertEq(policy.maxPerTx(address(0)), 1 ether);
    }
    
    function testIsAllowedWhenPaused() public {
        vm.prank(owner);
        policy.setPaused(true);
        
        (bool allowed, string memory reason) = policy.isAllowed(address(token), recipient1, 100);
        assertFalse(allowed);
        assertEq(reason, "PAUSED");
    }
    
    function testIsAllowedDisallowedRecipient() public {
        (bool allowed, string memory reason) = policy.isAllowed(address(token), recipient1, 100);
        assertFalse(allowed);
        assertEq(reason, "DISALLOWED_RECIPIENT");
    }
    
    function testIsAllowedExceedsMax() public {
        uint256 maxAmount = 1000 * 10**18;
        
        vm.prank(owner);
        policy.setAllowedRecipient(recipient1, true);
        vm.prank(owner);
        policy.setMaxPerTx(address(token), maxAmount);
        
        (bool allowed, string memory reason) = policy.isAllowed(address(token), recipient1, maxAmount + 1);
        assertFalse(allowed);
        assertEq(reason, "EXCEEDS_MAX_PER_TX");
    }
    
    function testIsAllowedSuccess() public {
        uint256 amount = 100 * 10**18;
        
        vm.prank(owner);
        policy.setAllowedRecipient(recipient1, true);
        vm.prank(owner);
        policy.setMaxPerTx(address(token), 1000 * 10**18);
        
        (bool allowed, string memory reason) = policy.isAllowed(address(token), recipient1, amount);
        assertTrue(allowed);
        assertEq(reason, "");
    }
    
    function testGuardBlocksWhenPaused() public {
        vm.prank(owner);
        policy.setPaused(true);
        
        vm.expectRevert("PAUSED");
        guard.checkTransaction(
            recipient1,
            1 ether,
            "",
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            "",
            owner
        );
    }
    
    function testGuardBlocksDisallowedRecipient() public {
        vm.expectRevert("DISALLOWED_RECIPIENT");
        guard.checkTransaction(
            recipient1,
            1 ether,
            "",
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            "",
            owner
        );
    }
    
    function testGuardBlocksExceedsMax() public {
        uint256 maxAmount = 1 ether;
        
        vm.prank(owner);
        policy.setAllowedRecipient(recipient1, true);
        vm.prank(owner);
        policy.setMaxPerTx(address(0), maxAmount);
        
        vm.expectRevert("EXCEEDS_MAX_PER_TX");
        guard.checkTransaction(
            recipient1,
            maxAmount + 1,
            "",
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            "",
            owner
        );
    }
    
    function testGuardAllowsValidTransfer() public {
        uint256 amount = 0.5 ether;
        
        vm.prank(owner);
        policy.setAllowedRecipient(recipient1, true);
        vm.prank(owner);
        policy.setMaxPerTx(address(0), 1 ether);
        
        // Should not revert
        guard.checkTransaction(
            recipient1,
            amount,
            "",
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            "",
            owner
        );
    }
}
