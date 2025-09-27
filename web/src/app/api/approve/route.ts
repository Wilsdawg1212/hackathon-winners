import { NextRequest, NextResponse } from 'next/server';
import { getQueued, removeQueued, addActivity } from '@/lib/store';
import { executeErc20TransferViaSafe } from '@/lib/safe';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body: { id: string } = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing queued item ID' },
        { status: 400 }
      );
    }

    // Find the queued item
    const queuedItems = getQueued();
    const queuedItem = queuedItems.find(item => item.id === id);

    if (!queuedItem) {
      return NextResponse.json(
        { error: 'Queued item not found' },
        { status: 404 }
      );
    }

    // Execute the transaction
    try {
      const { txHash } = await executeErc20TransferViaSafe(
        process.env.NEXT_PUBLIC_SAFE_ADDRESS || '',
        queuedItem.token,
        queuedItem.to,
        queuedItem.amount
      );

      // Remove from queue
      removeQueued(id);

      // Add to activity
      const activityItem = {
        id: uuidv4(),
        at: new Date().toISOString(),
        type: 'EXECUTED' as const,
        to: queuedItem.to,
        token: queuedItem.token,
        amount: queuedItem.amount,
        txHash,
        actor: 'Approver' // In real implementation, this would be the approver's address
      };
      addActivity(activityItem);

      return NextResponse.json({ success: true, txHash });
    } catch (error) {
      console.error('Approval execution failed:', error);
      return NextResponse.json(
        { error: 'Failed to execute approved transaction' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Approve API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
