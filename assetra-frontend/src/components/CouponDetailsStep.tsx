import React from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

interface CouponDetailsStepProps {
  formData: {
    couponType: string;
    couponRate: number;
    couponFrequency: string;
    firstCouponDate: string;
    lastCouponDate: string;
    totalCoupons: number;
  };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
  onBack: () => void;
  isOptional?: boolean;
}

export default function CouponDetailsStep({ formData, onChange, onNext, onBack, isOptional = false }: CouponDetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const validateCouponRate = (value: string) => {
    const rate = parseFloat(value);
    if (rate < 0) return 0;
    if (rate > 100) return 100;
    return rate;
  };

  const validateTotalCoupons = (value: string) => {
    const coupons = parseInt(value);
    if (coupons < 1) return 1;
    if (coupons > 100) return 100;
    return coupons;
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Type {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The type of interest payment structure for your bond. Fixed rate means consistent payments, floating rate varies with a reference rate, and zero coupon means no periodic payments." />
          </label>
          <select
            required={!isOptional}
            value={formData.couponType}
            onChange={(e) => onChange('couponType', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="fixed">Fixed</option>
            <option value="floating">Floating</option>
            <option value="zero">Zero Coupon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Rate (%) {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The annual interest rate paid to bondholders, expressed as a percentage of the bond's face value. Must be between 0% and 100%." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="0"
            max="100"
            step="0.001"
            value={formData.couponRate}
            onChange={(e) => onChange('couponRate', validateCouponRate(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
            placeholder="e.g., 5.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Frequency {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="How often interest payments are made to bondholders. More frequent payments mean smaller individual payments but more transactions." />
          </label>
          <select
            required={!isOptional}
            value={formData.couponFrequency}
            onChange={(e) => onChange('couponFrequency', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          >
            <option value="">Select frequency</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annual">Semi-Annual</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Coupons {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The total number of interest payments that will be made over the bond's lifetime. This is calculated based on the frequency and term of the bond." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="1"
            max="100"
            value={formData.totalCoupons}
            onChange={(e) => onChange('totalCoupons', validateTotalCoupons(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Coupon Date {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The date when the first interest payment will be made. This date sets the schedule for all future payments based on the chosen frequency." />
          </label>
          <input
            type="date"
            required={!isOptional}
            value={formData.firstCouponDate}
            onChange={(e) => onChange('firstCouponDate', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Coupon Date {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The date of the final interest payment, which typically coincides with the bond's maturity date when the principal is repaid." />
          </label>
          <input
            type="date"
            required={!isOptional}
            value={formData.lastCouponDate}
            onChange={(e) => onChange('lastCouponDate', e.target.value)}
            min={formData.firstCouponDate}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
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