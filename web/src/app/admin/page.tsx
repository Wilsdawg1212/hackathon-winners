'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Budget {
  address: string;
  budget: number;
}

export default function Admin() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  async function fetchBudgets() {
    const { data, error } = await supabase.from('budgets').select('*');
    if (data) {
      setBudgets(data);
    } else {
      console.error(error?.message || 'Failed to fetch budgets');
    }
  }

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('budgets').insert([{ address: newAddress, budget: parseFloat(newBudget) }]);
    if (!error) {
      setNewAddress('');
      setNewBudget('');
      fetchBudgets();
    } else {
      console.error(error.message || 'Failed to add budget');
    }
  };

  const handleUpdateBudget = async (address: string, budget: string) => {
    const { error } = await supabase.from('budgets').update({ budget: parseFloat(budget) }).eq('address', address);
    if (!error) {
      fetchBudgets();
    } else {
      console.error(error.message || 'Failed to update budget');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-start mb-16">
          <div className="text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              GroupSafe Admin
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Manage user budgets and permissions.
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Add New Budget</h2>
          <form onSubmit={handleAddBudget} className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="User Address (0x...)"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="border border-solid border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Budget (ETH)"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="border border-solid border-gray-300 rounded-md px-3 py-2 w-48 focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Add
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Manage Budgets</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-200 p-4 text-gray-700">Address</th>
                <th className="border-b-2 border-gray-200 p-4 text-gray-700">Budget (ETH)</th>
                <th className="border-b-2 border-gray-200 p-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((item) => (
                <tr key={item.address}>
                  <td className="border-b border-gray-200 p-4 font-mono text-sm text-gray-800">{item.address}</td>
                  <td className="border-b border-gray-200 p-4">
                    <input
                      type="number"
                      defaultValue={item.budget}
                      onBlur={(e) => handleUpdateBudget(item.address, e.target.value)}
                      className="border border-solid border-gray-300 rounded-md px-3 py-2 w-48 focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border-b border-gray-200 p-4">
                    <button onClick={() => handleUpdateBudget(item.address, (document.querySelector(`input[defaultValue='${item.budget}']`) as HTMLInputElement).value)} className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-lg transition-colors text-sm">
                        Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
