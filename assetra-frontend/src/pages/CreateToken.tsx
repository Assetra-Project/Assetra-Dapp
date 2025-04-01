import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenDetailsStep from '../components/TokenDetailsStep';
import ConfigurationDetailsStep from '../components/ConfigurationDetailsStep';
import CouponDetailsStep from '../components/CouponDetailsStep';
import RegulationStep from '../components/RegulationStep';
import TokenizationStep from '../components/TokenizationStep';

const STEPS = [
  'Token Details',
  'Configuration',
  'Coupon Details',
  'Regulation',
  'Create Token'
];

export default function CreateToken() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Token Details
    name: '',
    symbol: '',
    decimals: 3,
    isin: '',

    // Configuration
    currency: '',
    bondUnits: 0,
    nominalValue: 0,
    totalValue: 0,
    startingDate: '',
    maturityDate: '',
    investmentAmount: 0,
    fractionalDenomination: 0,

    // Coupon Details
    couponType: '',
    couponRate: 0,
    couponFrequency: '',
    firstCouponDate: '',
    lastCouponDate: '',
    totalCoupons: 1,

    // Regulation
    regulationType: '',
    regulationSubType: 'none',
    blockedCountries: ['Cuba', 'North Korea', 'Iran', 'Syrian Arab Republic'],
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'bondUnits' || field === 'nominalValue' ? {
        totalValue: (field === 'bondUnits' ? value : prev.bondUnits) * 
                   (field === 'nominalValue' ? value : prev.nominalValue)
      } : {})
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TokenDetailsStep
            formData={formData}
            onChange={handleFieldChange}
            onNext={handleNext}
            isOptional={true}
          />
        );
      case 2:
        return (
          <ConfigurationDetailsStep
            formData={formData}
            onChange={handleFieldChange}
            onNext={handleNext}
            onBack={handleBack}
            isOptional={true}
          />
        );
      case 3:
        return (
          <CouponDetailsStep
            formData={formData}
            onChange={handleFieldChange}
            onNext={handleNext}
            onBack={handleBack}
            isOptional={true}
          />
        );
      case 4:
        return (
          <RegulationStep
            formData={formData}
            onChange={handleFieldChange}
            onNext={handleNext}
            onBack={handleBack}
            isOptional={true}
          />
        );
      case 5:
        return (
          <TokenizationStep formData={formData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bricolage font-semibold text-[#11190c] mb-2 sm:mb-0">Create Token</h2>
          <span className="text-sm text-gray-500">Step {currentStep} of {STEPS.length}</span>
        </div>
        
        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
            <div
              className="h-full bg-[#11190c] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = index + 1 < currentStep;
              const isCurrent = index + 1 === currentStep;

              return (
                <div key={step} className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted || isCurrent
                        ? 'bg-[#11190c] text-[#e6ff00]'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </motion.div>
                  <span className="mt-2 text-xs font-medium text-gray-600">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}