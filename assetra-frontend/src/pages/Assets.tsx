import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function Assets() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bricolage font-semibold text-[#11190c]">Assets</h2>
        <button className="flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-4 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors">
          <PlusCircle className="h-5 w-5" />
          Create Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center text-gray-500">
          No assets found. Create your first asset to get started.
        </div>
      </div>
    </div>
  );
}