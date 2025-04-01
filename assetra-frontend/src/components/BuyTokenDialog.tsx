import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Loader2 } from 'lucide-react';
import { tokenStore } from '../lib/store';

interface BuyTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: any | null;
}

export default function BuyTokenDialog({ open, onOpenChange, token }: BuyTokenDialogProps) {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const userId = localStorage.getItem('userEmail') || 'demo@example.com';

  if (!token) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validate amount
      const purchaseAmount = parseFloat(amount);
      if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      if (purchaseAmount > token.availableSupply) {
        throw new Error('Amount exceeds available supply');
      }

      // Create the trade
      const trade = tokenStore.createTrade({
        tokenId: token.id,
        type: 'buy',
        amount: purchaseAmount,
        price: token.priceHBAR,
        buyer: userId,
        seller: token.owner
      });

      // Update token supply
      token.availableSupply -= purchaseAmount;

      setSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      onOpenChange(false);
      window.location.reload(); // Refresh to update portfolio
    } catch (err) {
      console.error('Error purchasing token:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Buy {token.symbol}
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Price
              </label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-[#11190c]">
                  {token.priceHBAR.toLocaleString()} ℏ
                </p>
                <p className="text-sm text-gray-500">
                  ${token.priceUSD.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Buy
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                max={token.availableSupply}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
                placeholder="Enter amount"
              />
              <p className="mt-1 text-sm text-gray-500">
                Available: {token.availableSupply.toLocaleString()} tokens
              </p>
            </div>

            {amount && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-600 mb-2">Total Cost</p>
                <p className="text-xl font-semibold text-[#11190c]">
                  {(parseFloat(amount) * token.priceHBAR).toLocaleString()} ℏ
                </p>
                <p className="text-sm text-gray-500">
                  ${(parseFloat(amount) * token.priceUSD).toLocaleString()}
                </p>
              </motion.div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isLoading || !amount || success}
                className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : success ? (
                  <>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-4 w-4 bg-green-500 rounded-full"
                    />
                    Success!
                  </>
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}