import { NextRequest, NextResponse } from 'next/server';
import { PayRequest, PayResponse, ActivityItem, QueuedItem } from '@/types';
import { groupOps } from '@/lib/groupOps';
import { executeErc20TransferViaSafe } from '@/lib/safe';
import { addQueued, addActivity } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body: PayRequest & { from: string } = await request.json();
    const { to, token, amount, from } = body;

    // Validate input
    if (!to || !token || !amount || !from) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if paused
    const isPaused = await groupOps.paused();
    if (isPaused) {
      const activityItem: ActivityItem = {
        id: uuidv4(),
        at: new Date().toISOString(),
        type: 'BLOCKED',
        to,
        token,
        amount,
        reason: 'Spending paused by owner',
        actor: from
      };
      addActivity(activityItem);

      return NextResponse.json({
        decision: 'Block',
        reason: 'Spending paused by owner'
      } as PayResponse);
    }

    // Enforce policy
    const policyResult = await groupOps.enforcePolicy(token, to, amount);
    
    if (policyResult.decision === 'Allow') {
      // Execute transaction
      try {
        const { txHash } = await executeErc20TransferViaSafe(
          process.env.NEXT_PUBLIC_SAFE_ADDRESS || '',
          token,
          to,
          amount
        );

        const activityItem: ActivityItem = {
          id: uuidv4(),
          at: new Date().toISOString(),
          type: 'EXECUTED',
          to,
          token,
          amount,
          txHash,
          actor: from
        };
        addActivity(activityItem);

        return NextResponse.json({
          decision: 'Allow',
          txHash
        } as PayResponse);
      } catch (error) {
        console.error('Transaction execution failed:', error);
        return NextResponse.json(
          { error: 'Transaction execution failed' },
          { status: 500 }
        );
      }
    } else if (policyResult.decision === 'Escalate') {
      // Queue for approval
      const queuedItem: QueuedItem = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        to,
        token,
        amount,
        reason: policyResult.reason || 'Requires approval',
        from
      };
      addQueued(queuedItem);

      const activityItem: ActivityItem = {
        id: uuidv4(),
        at: new Date().toISOString(),
        type: 'QUEUED',
        to,
        token,
        amount,
        reason: policyResult.reason,
        actor: from
      };
      addActivity(activityItem);

      return NextResponse.json({
        decision: 'Escalate',
        queuedId: queuedItem.id
      } as PayResponse);
    } else {
      // Block transaction
      const activityItem: ActivityItem = {
        id: uuidv4(),
        at: new Date().toISOString(),
        type: 'BLOCKED',
        to,
        token,
        amount,
        reason: policyResult.reason || 'Blocked by policy',
        actor: from
      };
      addActivity(activityItem);

      return NextResponse.json({
        decision: 'Block',
        reason: policyResult.reason
      } as PayResponse);
    }
  } catch (error) {
    console.error('Pay API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
