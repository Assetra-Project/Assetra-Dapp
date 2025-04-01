import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, PlusCircle, TrendingUp, TrendingDown, ExternalLink, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tokenStore } from '../lib/store';
import { cn } from '../lib/utils';

export default function Portfolio() {
  const [userTokens, setUserTokens] = useState([]);
  const [userTrades, setUserTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userEmail') || 'demo@example.com';

  useEffect(() => {
    const loadData = async () => {
      // Load user's tokens and trades
      setUserTokens(tokenStore.getUserTokens(userId));
      setUserTrades(tokenStore.getUserTrades(userId));
      setIsLoading(false);

      // Update token values periodically
      const interval = setInterval(() => {
        const updatedTokens = tokenStore.getUserTokens(userId).map(token => ({
          ...token,
          priceHBAR: token.priceHBAR * (1 + (Math.random() * 0.02 - 0.01)),
          priceUSD: token.priceUSD * (1 + (Math.random() * 0.02 - 0.01)),
        }));
        setUserTokens(updatedTokens);
      }, 5000);

      return () => clearInterval(interval);
    };

    loadData();
  }, [userId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatHBAR = (value: number) => {
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ℏ`;
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="w-8 h-8 border-2 border-[#11190c] border-t-transparent rounded-full animate-spin" />
      </motion.div>
    );
  }

  if (userTokens.length === 0 && userTrades.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bricolage font-semibold text-[#11190c]">Portfolio</h2>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <Store className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Assets Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            You haven't created any tokens yet. Start by creating your first token and listing it on the NSE marketplace.
          </p>
          <div className="flex gap-4">
            <Link
              to="/dashboard/create-token"
              className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors"
            >
              Create Token
            </Link>
            <Link
              to="/dashboard/marketplace"
              className="border-2 border-[#11190c] text-[#11190c] px-6 py-2 rounded-lg hover:bg-[#11190c]/5 transition-colors"
            >
              Visit Marketplace
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const totalValue = userTokens.reduce((acc, token) => 
    acc + (token.priceUSD * token.totalSupply), 0
  );

  const totalValueHBAR = userTokens.reduce((acc, token) =>
    acc + (token.priceHBAR * token.totalSupply), 0
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bricolage font-semibold text-[#11190c]">Portfolio</h2>
          <p className="text-gray-600 mt-1">
            Total Value: {formatCurrency(totalValue)} / {formatHBAR(totalValueHBAR)}
          </p>
        </div>
        <Link
          to="/dashboard/create-token"
          className="flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-4 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Create Token
        </Link>
      </div>

      {/* Tokens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {userTokens.map((token) => (
            <motion.div
              key={token.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={token.imageUrl || "https://images.unsplash.com/photo-1634542984003-e0fb8e200e91?q=80&w=2069&auto=format&fit=crop"}
                  alt={token.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-50">
                    {token.type === 'bond' ? 'Bond' : 'Asset'}
                  </span>
                </div>

                {token.isNSEListed && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-50">
                      Listed on NSE
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900">{token.name}</h3>
                  <p className="text-sm text-gray-500">
                    {token.symbol} • {token.isin}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-lg font-semibold text-[#11190c]">
                      {formatHBAR(token.priceHBAR)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(token.priceUSD)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Supply</p>
                    <p className="text-lg font-semibold text-[#11190c]">
                      {token.totalSupply.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">tokens</p>
                  </div>
                </div>

                <div className="h-20 mb-4">
                  {token.chart7d && (
                    <div className="w-full h-full flex items-end justify-between">
                      {token.chart7d.map((value, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / Math.max(...token.chart7d)) * 100}%` }}
                          className="w-[8%] rounded-t bg-[#11190c]/20"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  {token.isNSEListed ? (
                    <Link
                      to="/dashboard/marketplace"
                      className="flex items-center gap-2 text-sm text-[#11190c] hover:text-[#11190c]/70 transition-colors"
                    >
                      <BarChart3 className="h-4 w-4" />
                      View on NSE
                    </Link>
                  ) : (
                    <button
                      onClick={() => {/* Handle listing */}}
                      className="flex items-center gap-2 text-sm text-[#11190c] hover:text-[#11190c]/70 transition-colors"
                    >
                      <Store className="h-4 w-4" />
                      List on NSE
                    </button>
                  )}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="font-medium text-[#11190c]">
                      {formatCurrency(token.priceUSD * token.totalSupply)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recent Trades */}
      {userTrades.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Trades</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
              {userTrades.map((trade) => {
                const token = userTokens.find(t => t.id === trade.tokenId);
                if (!token) return null;

                return (
                  <motion.div
                    key={trade.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-sm font-medium",
                            trade.type === 'buy' 
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            {trade.type === 'buy' ? 'Bought' : 'Sold'}
                          </span>
                          <h4 className="text-lg font-medium text-gray-900">
                            {token.name}
                          </h4>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span>{new Date(trade.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{trade.amount.toLocaleString()} tokens</span>
                          <span>•</span>
                          <span>{token.symbol}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatHBAR(trade.amount * trade.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          at {formatHBAR(trade.price)} per token
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}