import React from 'react';
import { Wallet } from 'lucide-react';

interface SettlementStepProps {
  onNext: () => void;
}

export default function SettlementStep({ onNext }: SettlementStepProps) {
  return (
    <form className="space-y-6">
      <div className="space-y-6">
        {/* Account Type Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Please select an option:</h3>
          <div className="space-y-4">
            <label className="block p-4 rounded-xl border-2 border-gray-900 bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <input
                  type="radio"
                  name="accountType"
                  value="individual"
                  className="mt-1 text-gray-900 focus:ring-gray-900"
                />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Individual Account</span>
                  <span className="block text-sm text-gray-500">
                    Open an account that will be used for personal investments.
                  </span>
                </div>
              </div>
            </label>

            <label className="block p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer">
              <div className="flex items-start">
                <input
                  type="radio"
                  name="accountType"
                  value="corporate"
                  className="mt-1 text-gray-900 focus:ring-gray-900"
                />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Corporate Account</span>
                  <span className="block text-sm text-gray-500">
                    Open an account for your organization or business entity.
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor Settlement Account (Bank account number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor Settlement Account Title (Account holder's name at the bank) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Settlement Bank (Commercial bank) <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Please select an option</option>
              <option value="equity">Equity Bank</option>
              <option value="kcb">KCB Bank</option>
              <option value="cooperative">Cooperative Bank</option>
              <option value="stanbic">Stanbic Bank</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Next
          <Wallet className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}