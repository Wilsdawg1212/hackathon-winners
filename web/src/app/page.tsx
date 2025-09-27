'use client';

import { useEffect, useState, useCallback } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { PolicySummary, ActivityItem } from '@/types';
import { formatAddress, formatTime } from '@/lib/format';
import { formatTokenAmount } from '@/lib/format';
import { getExplorerTxUrl } from '@/lib/chain';
import { Copy, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [policySummary, setPolicySummary] = useState<PolicySummary | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [paused, setPaused] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS || '0x1234567890123456789012345678901234567890';

  const loadData = useCallback(async () => {
    try {
      // Load policy summary
      const policyRes = await fetch('/api/policy/summary');
      if (policyRes.ok) {
        const policyData = await policyRes.json();
        if (policyData.success) {
          setPolicySummary(policyData.data);
          setPaused(policyData.data.paused);
        }
      }

      // Load recent activity
      const activityRes = await fetch('/api/activity?limit=5');
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        if (activityData.success) {
          setRecentActivity(activityData.data);
        }
      }

      // Check if connected wallet is owner (simplified for demo)
      setIsOwner(isConnected && address === '0x1234567890123456789012345678901234567890');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handlePauseToggle = async () => {
    try {
      const response = await fetch('/api/policy/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: !paused })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPaused(!paused);
        } else {
          alert('Failed to update pause status: ' + result.error);
        }
      } else {
        alert('Failed to update pause status');
      }
    } catch (error) {
      console.error('Pause toggle failed:', error);
      alert('Failed to update pause status');
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(safeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const seedDemo = async () => {
    try {
      await fetch('/api/seed-demo', { method: 'POST' });
      loadData();
    } catch (error) {
      console.error('Failed to seed demo data:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'EXECUTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'BLOCKED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'EXECUTED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading GroupSafe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GroupSafe</h1>
          <p className="text-xl text-gray-600">Lightweight control layer for shared crypto treasuries</p>
        </div>

        {/* Safe Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Safe Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Safe Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded text-black">
                  {formatAddress(safeAddress)}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Chain ID</label>
              <p className="text-sm text-gray-900 mt-1">
                {process.env.NEXT_PUBLIC_CHAIN_ID || '1'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="text-sm text-gray-900 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  paused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {paused ? 'Paused' : 'Active'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Policy Summary */}
        {policySummary && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Max Per Transaction (Native)</label>
                <p className="text-sm text-black mt-1">{policySummary.maxPerTxNative} ETH</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Per Transaction (USDC)</label>
                <p className="text-sm text-black mt-1">{policySummary.maxPerTxUSDC} USDC</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-sm text-gray-900 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    policySummary.paused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {policySummary.paused ? 'Paused' : 'Active'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/pay"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Make a Payment
          </Link>
          <Link
            href="/approvals"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            View Approvals
          </Link>
          <Link
            href="/activity"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            View Activity
          </Link>
        </div>

        {/* Pause Toggle (Owner Only) */}
        {isOwner && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Controls</h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Pause Spending</label>
              <button
                onClick={handlePauseToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  paused ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    paused ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500">
                {paused ? 'Spending is paused' : 'Spending is active'}
              </span>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(item.type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(item.type)}`}>
                          {item.type}
                        </span>
                        <span className="text-sm text-black">{formatAddress(item.to)}</span>
                      </div>
                      <p className="text-xs text-gray-500">{formatTime(item.at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatTokenAmount(item.amount)}</p>
                    {item.tx_hash && (
                      <a
                        href={getExplorerTxUrl(item.tx_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View Tx
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>

        {/* Development Tools */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Development Tools</h3>
            <div className="space-x-2">
              <button
                onClick={seedDemo}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded"
              >
                Seed Demo Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}