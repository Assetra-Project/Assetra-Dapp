import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface OnboardingStepProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
}

export default function OnboardingStep({ currentStep, totalSteps, title, children }: OnboardingStepProps) {
  const progress = (currentStep / totalSteps) * 100;
  const steps = ['Details', 'Contact', 'Settlement details', 'Documents', 'Create Token'];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-0">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bricolage font-semibold text-gray-900 mb-2 sm:mb-0">{title}</h2>
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        
        {/* Progress Steps */}
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
            <motion.div 
              className="h-full bg-[#11190c]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index + 1 < currentStep;
              const isCurrent = index + 1 === currentStep;

              return (
                <motion.div 
                  key={step}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "transition-all duration-200",
                      isCompleted ? "bg-[#11190c] text-[#e6ff00]" :
                      isCurrent ? "bg-white border-2 border-[#11190c] text-[#11190c]" :
                      "bg-white border-2 border-gray-200 text-gray-400"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.div>
                  <span 
                    className={cn(
                      "mt-2 text-xs font-medium hidden sm:block",
                      isCompleted ? "text-[#11190c]" :
                      isCurrent ? "text-[#11190c]" :
                      "text-gray-400"
                    )}
                  >
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}