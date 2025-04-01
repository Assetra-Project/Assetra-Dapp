import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';
import { ethersService } from '../lib/ethers';
import { ExternalLink, Wallet } from 'lucide-react';

interface ConfigurationDetailsStepProps {
  formData: {
    currency: string;
    bondUnits: number;
    nominalValue: number;
    totalValue: number;
    startingDate: string;
    maturityDate: string;
    investmentAmount: number;
    fractionalDenomination: number;
  };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
  onBack: () => void;
  isOptional?: boolean;
}

export default function ConfigurationDetailsStep({ formData, onChange, onNext, onBack, isOptional = false }: ConfigurationDetailsStepProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsMetaMask, setNeedsMetaMask] = useState(false);
  const [isRequestingAccount, setIsRequestingAccount] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum === 'undefined') {
        setNeedsMetaMask(true);
        return;
      }

      try {
        const address = await ethersService.getConnectedAddress();
        setIsConnected(!!address);
        setError(null);
      } catch (error) {
        console.error('Error checking connection:', error);
        setIsConnected(false);
      }
    };

    checkMetaMask();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOptional) {
      onNext();
      return;
    }

    setError(null);
    setIsLoading(true);

    if (typeof window.ethereum === 'undefined') {
      setNeedsMetaMask(true);
      setIsLoading(false);
      return;
    }

    try {
      if (!isConnected && !isRequestingAccount) {
        setIsRequestingAccount(true);
        await ethersService.connectWallet();
        setIsConnected(true);
      }

      // Convert dates to Unix timestamps
      const startDate = Math.floor(new Date(formData.startingDate).getTime() / 1000);
      const maturityDate = Math.floor(new Date(formData.maturityDate).getTime() / 1000);

      await ethersService.configureBond(
        'KE0123456789', // Example ISIN - this should come from previous step
        formData.bondUnits,
        formData.nominalValue,
        formData.totalValue,
        formData.investmentAmount,
        formData.fractionalDenomination,
        startDate,
        maturityDate
      );

      onNext();
    } catch (err: any) {
      console.error('Error configuring bond:', err);
      if (err.code === 4001) {
        setError('You rejected the connection request. Please try again.');
      } else if (err.code === -32002) {
        setError('Please check MetaMask to complete the connection.');
      } else {
        setError(err.message || 'An error occurred while configuring the bond');
      }
    } finally {
      setIsLoading(false);
      setIsRequestingAccount(false);
    }
  };

  if (needsMetaMask) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-6">
          <img 
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
            alt="MetaMask Logo"
            className="w-full h-full"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          MetaMask is Required
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          To configure bonds and interact with the blockchain, you need to install the MetaMask browser extension.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors inline-flex items-center gap-2"
        >
          Install MetaMask
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="mt-4 text-sm text-gray-500">
          After installation, please refresh this page.
        </p>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The currency in which the bond will be denominated. This determines the currency of all payments and valuations." />
          </label>
          <select
            required={!isOptional}
            value={formData.currency}
            onChange={(e) => onChange('currency', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          >
            <option value="">Select currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="KES">KES</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Bond Units {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The total number of individual bonds being issued. Each unit represents one bond with the specified nominal value." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="1"
            value={formData.bondUnits}
            onChange={(e) => onChange('bondUnits', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nominal Value {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The face value or par value of each bond unit. This is the amount that will be repaid at maturity." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="0"
            step="0.01"
            value={formData.nominalValue}
            onChange={(e) => onChange('nominalValue', parseFloat(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Value
            <Tooltip content="The total value of the bond issuance, calculated automatically as (Number of Bond Units × Nominal Value)." />
          </label>
          <input
            type="number"
            value={formData.totalValue}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The minimum investment amount required to participate in the bond offering." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="0"
            step="0.01"
            value={formData.investmentAmount}
            onChange={(e) => onChange('investmentAmount', parseFloat(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fractional Denomination {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The smallest unit into which the bond can be divided for trading purposes." />
          </label>
          <input
            type="number"
            required={!isOptional}
            min="0"
            step="0.01"
            value={formData.fractionalDenomination}
            onChange={(e) => onChange('fractionalDenomination', parseFloat(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Starting Date {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The issue date of the bond. This is when the bond term begins and interest starts accruing." />
          </label>
          <input
            type="date"
            required={!isOptional}
            value={formData.startingDate}
            onChange={(e) => onChange('startingDate', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maturity Date {!isOptional && <span className="text-red-500">*</span>}
            <Tooltip content="The date when the bond reaches maturity and the principal amount must be repaid to bondholders." />
          </label>
          <input
            type="date"
            required={!isOptional}
            value={formData.maturityDate}
            onChange={(e) => onChange('maturityDate', e.target.value)}
            min={formData.startingDate}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#e6ff00]"></span>
              Configuring...
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </motion.form>
  );
}