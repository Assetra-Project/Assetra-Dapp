import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { tokenStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

interface TokenizationStepProps {
  formData?: any;
}

export default function TokenizationStep({ formData = {} }: TokenizationStepProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'creating' | 'success'>('idle');
  const userId = localStorage.getItem('userEmail') || 'demo@example.com';

  const handleCreateToken = async () => {
    try {
      setStatus('creating');
      
      // Simulate token creation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create the token with default values if formData properties are missing
      const token = tokenStore.createToken({
        name: formData?.name || 'Untitled Token',
        symbol: formData?.symbol || 'TOKEN',
        decimals: formData?.decimals || 2,
        isin: formData?.isin || crypto.randomUUID(),
        totalSupply: formData?.bondUnits || 1000000,
        availableSupply: formData?.bondUnits || 1000000,
        price: formData?.nominalValue || 1000,
        owner: userId,
        type: 'bond',
        description: `${formData?.name || 'Untitled Token'} - Created on ${new Date().toLocaleDateString()}`,
        sector: 'Finance',
        imageUrl: 'https://images.unsplash.com/photo-1634542984003-e0fb8e200e91?q=80&w=2069&auto=format&fit=crop',
        priceHBAR: formData?.nominalValue || 1000,
        priceUSD: formData?.nominalValue || 1000,
        marketCapHBAR: (formData?.nominalValue || 1000) * (formData?.bondUnits || 1000000),
        marketCapUSD: (formData?.nominalValue || 1000) * (formData?.bondUnits || 1000000),
        volume24hHBAR: 0,
        volume24hUSD: 0,
        chart7d: Array(7).fill(formData?.nominalValue || 1000)
      });

      setStatus('success');

      // Wait a moment to show success state
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to portfolio
      navigate('/dashboard/portfolio');
    } catch (error) {
      console.error('Error creating token:', error);
      setStatus('idle');
    }
  };

  return (
    <div className="text-center py-8">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="max-w-lg mx-auto">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                Ready to Create Your Token
              </h3>
              <div className="bg-[#11190c]/5 rounded-xl p-6 mb-6">
                <dl className="space-y-4 text-left">
                  <div>
                    <dt className="text-sm text-gray-500">Token Name</dt>
                    <dd className="text-lg font-medium text-gray-900">{formData?.name || 'Untitled Token'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Symbol</dt>
                    <dd className="text-lg font-medium text-gray-900">{formData?.symbol || 'TOKEN'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Total Supply</dt>
                    <dd className="text-lg font-medium text-gray-900">{(formData?.bondUnits || 1000000).toLocaleString()} tokens</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Initial Price</dt>
                    <dd className="text-lg font-medium text-gray-900">{(formData?.nominalValue || 1000).toLocaleString()} ℏ</dd>
                  </div>
                </dl>
              </div>
              <p className="text-gray-600 mb-2">
                Your token will be created and added to your portfolio automatically.
              </p>
              <p className="text-sm text-gray-500">
                You can then list it on the NSE marketplace for trading.
              </p>
            </div>
            <motion.button
              onClick={handleCreateToken}
              className="inline-flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-8 py-3 rounded-lg hover:bg-[#11190c]/90 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Token
            </motion.button>
          </motion.div>
        )}

        {status === 'creating' && (
          <motion.div
            key="creating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="h-12 w-12 text-[#11190c] animate-spin" />
            <p className="text-lg font-medium text-gray-900">Creating Your Token</p>
            <p className="text-sm text-gray-500">This will only take a moment...</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-12 w-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium text-gray-900">Token Created Successfully!</p>
            <p className="text-sm text-gray-500">Redirecting to your portfolio...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}