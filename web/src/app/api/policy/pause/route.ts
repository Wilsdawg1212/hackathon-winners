import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { getSafe, getSafeService, proposeSafeTx } from '@/lib/safe';
import { groupOpsPolicyAbi } from '@/lib/abis/groupOpsPolicy';
import { appendActivity } from '@/lib/supabase';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
const POLICY_ADDRESS = process.env.NEXT_PUBLIC_POLICY_ADDRESS || '0x0000000000000000000000000000000000000000';
const SAFE_ADDRESS = process.env.NEXT_PUBLIC_SAFE_ADDRESS || '0x0000000000000000000000000000000000000000';

export async function POST(request: NextRequest) {
  try {
    const { paused } = await request.json();
    
    if (typeof paused !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid paused value' },
        { status: 400 }
      );
    }

    // Create a private key from environment (for demo purposes)
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { success: false, error: 'Private key not configured' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);
    
    const safe = await getSafe({ signer });
    const safeService = await getSafeService();
    
    // Build calldata for setPaused
    const policy = new ethers.Contract(POLICY_ADDRESS, groupOpsPolicyAbi, provider);
    const calldata = policy.interface.encodeFunctionData('setPaused', [paused]);
    
    // Propose Safe transaction
    const { safeTxHash } = await proposeSafeTx({
      safe,
      safeService,
      txData: {
        to: POLICY_ADDRESS,
        value: '0',
        data: calldata,
      },
      signer,
    });

    // Log activity
    await appendActivity({
      type: 'PENDING',
      to: POLICY_ADDRESS,
      token: 'ADMIN',
      amount: '0',
      actor: await signer.getAddress(),
      tx_hash: safeTxHash,
      reason: `Policy ${paused ? 'paused' : 'unpaused'}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        status: 'Pending',
        safeTxHash,
      },
    });
  } catch (error) {
    console.error('Error setting pause state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set pause state' },
      { status: 500 }
    );
  }
}