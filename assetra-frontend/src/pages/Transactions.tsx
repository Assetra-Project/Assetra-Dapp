import React from 'react';

export default function Transactions() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bricolage font-semibold text-[#11190c]">Transactions</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center text-gray-500">
          No transactions found.
        </div>
      </div>
    </div>
  );
}