import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bricolage font-semibold text-[#11190c]">Settings</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[#11190c] mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={localStorage.getItem('userEmail') || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#11190c] mb-4">Network Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Network
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e6ff00] focus:border-transparent"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}