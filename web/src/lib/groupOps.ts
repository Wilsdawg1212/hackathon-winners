import { ethers } from 'ethers';
import { GROUP_OPS_ABI } from './abi/groupOpsAbi';
import { Decision, PolicyCheckResult } from '@/types';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://eth.llamarpc.com';
const GROUP_OPS_ADDRESS = process.env.NEXT_PUBLIC_GROUP_OPS_ADDRESS || '0x1234567890123456789012345678901234567890';

export class GroupOpsContract {
  private contract: ethers.Contract;
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(GROUP_OPS_ADDRESS, GROUP_OPS_ABI, this.provider);
  }

  async paused(): Promise<boolean> {
    try {
      return await this.contract.paused();
    } catch (error) {
      console.error('Failed to read paused status:', error);
      // Return default value for demo environment
      return false;
    }
  }

  async maxPerTx(): Promise<string> {
    try {
      const result = await this.contract.maxPerTx();
      return result.toString();
    } catch (error) {
      console.error('Failed to read maxPerTx:', error);
      // Return default value for demo environment
      return '1000';
    }
  }

  async isAllowedRecipient(to: string): Promise<boolean> {
    try {
      return await this.contract.isAllowedRecipient(to);
    } catch (error) {
      console.error('Failed to check allowed recipient:', error);
      // For demo, allow all recipients
      return true;
    }
  }

  async enforcePolicy(token: string, to: string, amount: string): Promise<PolicyCheckResult> {
    try {
      const result = await this.contract.enforcePolicy(token, to, amount);
      const decisionNum = Number(result);
      
      let decision: Decision;
      let reason: string | undefined;
      
      switch (decisionNum) {
        case 0:
          decision = 'Allow';
          break;
        case 1:
          decision = 'Escalate';
          reason = 'Transaction requires approval';
          break;
        case 2:
          decision = 'Block';
          reason = 'Transaction blocked by policy';
          break;
        default:
          decision = 'Block';
          reason = 'Unknown policy result';
      }
      
      return { decision, reason };
    } catch (error) {
      console.error('Failed to enforce policy:', error);
      // For demo, implement simple policy logic
      const amountNum = parseFloat(amount);
      if (amountNum > 100) {
        return { decision: 'Escalate', reason: 'Amount exceeds demo limit of 100' };
      } else if (amountNum <= 0) {
        return { decision: 'Block', reason: 'Invalid amount' };
      } else {
        return { decision: 'Allow' };
      }
    }
  }

  async setPaused(paused: boolean, signer: ethers.Signer): Promise<string> {
    try {
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract;
      const tx = await contractWithSigner.setPaused(paused);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to set paused status:', error);
      throw new Error('Failed to update pause status');
    }
  }
}

export const groupOps = new GroupOpsContract();
