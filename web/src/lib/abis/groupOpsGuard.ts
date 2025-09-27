export const groupOpsGuardAbi = [
  "function checkTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures, address msgSender) external",
  "function checkAfterExecution(bytes32 txHash, bool success) external"
] as const;
