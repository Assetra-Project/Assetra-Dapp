import React from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

interface TokenDetailsStepProps {
  formData: {
    name: string;
    symbol: string;
    decimals: number;
    isin: string;
  };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
  isOptional?: boolean;
}

export default function TokenDetailsStep({ formData, onChange, onNext, isOptional = false }: TokenDetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Name {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The full name of your token that will be displayed to users. Choose a clear, descriptive name that reflects the asset's purpose." />
          </label>
          <input
            type="text"
            required={!isOptional}
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
            placeholder="Enter token name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symbol {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="A short, unique identifier for your token (usually 3-5 characters). This will be used as the trading symbol on exchanges." />
          </label>
          <input
            type="text"
            required={!isOptional}
            value={formData.symbol}
            onChange={(e) => onChange('symbol', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
            placeholder="e.g., SG"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decimals {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The number of decimal places your token can be divided into. For most financial instruments, 3-6 decimals is standard. More decimals allow for smaller fractions." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="0"
            max="18"
            value={formData.decimals}
            onChange={(e) => onChange('decimals', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
            placeholder="e.g., 3"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISIN {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="International Securities Identification Number - A unique 12-character alphanumeric code that identifies your security internationally. Format: 2 letters (country code) + 9 characters + 1 check digit." />
          </label>
          <input
            type="text"
            required={!isOptional}
            value={formData.isin}
            onChange={(e) => onChange('isin', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
            placeholder="Enter ISIN number"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors"
        >
          Next
        </button>
      </div>
    </motion.form>
  );
}