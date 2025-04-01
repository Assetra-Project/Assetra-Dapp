import React from 'react';
import { motion } from 'framer-motion';

interface RegulationStepProps {
  formData: {
    regulationType: string;
    regulationSubType: string;
    blockedCountries: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  isOptional?: boolean;
}

const BLOCKED_COUNTRIES = [
  'Cuba',
  'Iran',
  'North Korea',
  'Syrian Arab Republic',
  // Add more countries as needed
];

export default function RegulationStep({ formData, onChange, onNext, onBack, isOptional = false }: RegulationStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleCountryChange = (country: string) => {
    const newBlockedCountries = formData.blockedCountries.includes(country)
      ? formData.blockedCountries.filter(c => c !== country)
      : [...formData.blockedCountries, country];
    onChange('blockedCountries', newBlockedCountries);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Regulation Type {!isOptional && <span className="text-red-500">*</span>}
          </label>
          <select
            required={!isOptional}
            value={formData.regulationType}
            onChange={(e) => onChange('regulationType', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="regulation_s">Regulation S</option>
            <option value="regulation_d">Regulation D</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Regulation Sub-type
          </label>
          <select
            value={formData.regulationSubType}
            onChange={(e) => onChange('regulationSubType', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="type_a">Type A</option>
            <option value="type_b">Type B</option>
            <option value="type_c">Type C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Blocked Countries
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BLOCKED_COUNTRIES.map(country => (
              <label key={country} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.blockedCountries.includes(country)}
                  onChange={() => handleCountryChange(country)}
                  className="rounded text-[#11190c] focus:ring-[#11190c]"
                />
                <span className="text-sm text-gray-700">{country}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Back
        </button>
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