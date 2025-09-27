'use client';

import { formatAddress } from '@/lib/format';

interface AddressBadgeProps {
  address: string;
  className?: string;
}

export default function AddressBadge({ address, className = '' }: AddressBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-black ${className}`}>
      {formatAddress(address)}
    </span>
  );
}
