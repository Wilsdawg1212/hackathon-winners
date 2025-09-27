'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { ActivityItem } from '@/types';
import { formatAddress, formatTime, formatTokenAmount } from '@/lib/format';
import { getExplorerTxUrl } from '@/lib/chain';
import AddressBadge from '@/components/AddressBadge';
import EmptyState from '@/components/EmptyState';
import { ArrowLeft, CheckCircle, Clock, XCircle, ExternalLink, Filter } from 'lucide-react';

export default function ActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  const filterOptions = [
    { value: 'All', label: 'All Activity' },
    { value: 'EXECUTED', label: 'Executed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'BLOCKED', label: 'Blocked' }
  ];

  useEffect(() => {
    loadActivity();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(item => item.type === filter));
    }
  }, [activities, filter]);

  const loadActivity = async () => {
    try {
      const response = await fetch('/api/activity');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setActivities(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to load activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'EXECUTED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'BLOCKED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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
          <p className="mt-4 text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity</h1>
              <p className="text-gray-600">Complete transaction history and audit trail</p>
            </div>
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <EmptyState
            title="No activity found"
            description={filter === 'All' 
              ? "No transactions have been recorded yet." 
              : `No ${filter.toLowerCase()} transactions found.`
            }
            actionLabel="Make a Payment"
            actionHref="/pay"
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {filter === 'All' ? 'All Activity' : `${filter} Transactions`}
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getActivityIcon(item.type)}
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(item.type)}`}>
                            {item.type}
                          </span>
                          <AddressBadge address={item.to} />
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTime(item.at)}</span>
                          <span>•</span>
                          <span>Actor: {formatAddress(item.actor)}</span>
                          {item.reason && (
                            <>
                              <span>•</span>
                              <span>{item.reason}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-black">
                          {formatTokenAmount(item.amount)} {item.token}
                        </p>
                        {item.tx_hash && (
                          <a
                            href={getExplorerTxUrl(item.tx_hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                          >
                            View Transaction
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
