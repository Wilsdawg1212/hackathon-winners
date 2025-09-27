import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { groupOpsPolicyAbi } from '@/lib/abis/groupOpsPolicy';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
const POLICY_ADDRESS = process.env.NEXT_PUBLIC_POLICY_ADDRESS || '0x0000000000000000000000000000000000000000';

export async function GET() {
  try {
    // If no policy address is configured, return demo data
    if (POLICY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({
        success: true,
        data: {
          paused: false,
          maxPerTxNative: '1.0',
          maxPerTxUSDC: '1000',
          allowedRecipientsCount: '3',
        },
      });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const policy = new ethers.Contract(POLICY_ADDRESS, groupOpsPolicyAbi, provider);
    
    const [paused, maxPerTxNative, maxPerTxUSDC, allowedRecipientsCount] = await policy.getPolicySummary();
    
    return NextResponse.json({
      success: true,
      data: {
        paused,
        maxPerTxNative: maxPerTxNative.toString(),
        maxPerTxUSDC: maxPerTxUSDC.toString(),
        allowedRecipientsCount: allowedRecipientsCount.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching policy summary:', error);
    
    // Return demo data on error for development
    return NextResponse.json({
      success: true,
      data: {
        paused: false,
        maxPerTxNative: '1.0',
        maxPerTxUSDC: '1000',
        allowedRecipientsCount: '3',
      },
    });
  }
}