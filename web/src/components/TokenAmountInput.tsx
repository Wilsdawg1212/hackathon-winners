'use client';

import { useState } from 'react';
import { DEMO_TOKENS } from '@/demo.config';

interface TokenAmountInputProps {
  token: string;
  amount: string;
  onTokenChange: (token: string) => void;
  onAmountChange: (amount: string) => void;
  maxAmount?: string;
  className?: string;
}

export default function TokenAmountInput({
  token,
  amount,
  onTokenChange,
  onAmountChange,
  maxAmount,
  className = ''
}: TokenAmountInputProps) {
  const [isValid, setIsValid] = useState(true);

  const handleAmountChange = (value: string) => {
    const num = parseFloat(value);
    const valid = !isNaN(num) && num > 0;
    setIsValid(valid);
    onAmountChange(value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              isValid ? 'border-gray-300' : 'border-red-300'
            }`}
          />
          {maxAmount && (
            <p className="text-xs text-gray-500 mt-1">
              Max per tx: {maxAmount}
            </p>
          )}
        </div>
        
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token
          </label>
          <select
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            {DEMO_TOKENS.map((tokenOption) => (
              <option key={tokenOption.address} value={tokenOption.address}>
                {tokenOption.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {!isValid && (
        <p className="text-sm text-red-600">Please enter a valid amount</p>
      )}
    </div>
  );
}
