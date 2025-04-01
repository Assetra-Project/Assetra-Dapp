import React from 'react';
import { Phone } from 'lucide-react';
import { cn } from '../lib/utils';

interface ContactStepProps {
  onNext: () => void;
}

export default function ContactStep({ onNext }: ContactStepProps) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main phone number <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="relative flex-shrink-0">
              <select
                className="h-full rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 py-2 pl-3 pr-7 text-gray-900 focus:border-gray-900 focus:ring-gray-900"
                defaultValue="+254"
              >
                <option value="+254">
                  🇰🇪 +254
                </option>
              </select>
            </div>
            <input
              type="tel"
              required
              placeholder="712 345 678"
              className="flex-1 rounded-r-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Alternative Phone */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternative phone number
          </label>
          <div className="flex">
            <div className="relative flex-shrink-0">
              <select
                className="h-full rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 py-2 pl-3 pr-7 text-gray-900 focus:border-gray-900 focus:ring-gray-900"
                defaultValue="+254"
              >
                <option value="+254">
                  🇰🇪 +254
                </option>
              </select>
            </div>
            <input
              type="tel"
              placeholder="712 345 678"
              className="flex-1 rounded-r-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Address */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building/Estate <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City/Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors"
        >
          Next
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}