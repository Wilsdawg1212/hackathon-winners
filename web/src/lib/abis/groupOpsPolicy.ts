export const groupOpsPolicyAbi = [
  "function paused() view returns (bool)",
  "function allowedRecipient(address) view returns (bool)",
  "function maxPerTx(address token) view returns (uint256)",
  "function setPaused(bool p)",
  "function setAllowedRecipient(address to, bool allowed)",
  "function setMaxPerTx(address token, uint256 amount)",
  "function isAllowed(address token, address to, uint256 amount) view returns (bool,string)",
  "function getPolicySummary() view returns (bool,uint256,uint256,uint256)"
] as const;
