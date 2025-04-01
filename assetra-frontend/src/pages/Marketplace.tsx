import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Store, X, TrendingUp, TrendingDown, Heart, BarChart3, Package } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { tokenStore } from '../lib/store';
import { cn } from '../lib/utils';
import BuyTokenDialog from '../components/BuyTokenDialog';

interface ListTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ListTokenDialog({ open, onOpenChange }: ListTokenDialogProps) {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [userTokens, setUserTokens] = useState<any[]>([]);
  const userId = localStorage.getItem('userEmail') || 'demo@example.com';

  useEffect(() => {
    // Get user's unlisted tokens
    const tokens = tokenStore.getUserTokens(userId).filter(token => !token.isNSEListed);
    setUserTokens(tokens);
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !price) return;

    try {
      tokenStore.listToken(selectedToken, parseFloat(price));
      onOpenChange(false);
    } catch (error) {
      console.error('Error listing token:', error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              List Token on NSE
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {userTokens.length === 0 ? (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You don't have any tokens to list.</p>
              <Dialog.Close asChild>
                <button className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors">
                  Create Token First
                </button>
              </Dialog.Close>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Token
                </label>
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
                >
                  <option value="">Choose a token</option>
                  {userTokens.map((token) => (
                    <option key={token.id} value={token.id}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Price (HBAR)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#11190c] focus:border-transparent"
                  placeholder="Enter price in HBAR"
                />
              </div>

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
                  className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-lg hover:bg-[#11190c]/90 transition-colors"
                >
                  List Token
                </button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ImagePreloader({ images }: { images: string[] }) {
  return (
    <div className="hidden">
      {images.map((src, index) => (
        <img key={index} src={src} alt="" />
      ))}
    </div>
  );
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'bond' | 'asset'>('all');
  const [listedTokens, setListedTokens] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showListDialog, setShowListDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [recentlyLiked, setRecentlyLiked] = useState<string | null>(null);

  useEffect(() => {
    const tokens = tokenStore.searchTokens(searchQuery, selectedType);
    setListedTokens(tokens);

    // Collect and preload all token images
    const images = tokens.map(token => token.imageUrl).filter(Boolean) as string[];
    setPreloadedImages(images);

    // Update prices every 5 seconds
    const interval = setInterval(() => {
      const updatedTokens = tokens.map(token => ({
        ...token,
        priceHBAR: (token.priceHBAR || 0) * (1 + (Math.random() * 0.02 - 0.01)),
        priceUSD: (token.priceUSD || 0) * (1 + (Math.random() * 0.02 - 0.01)),
      }));
      setListedTokens(updatedTokens);
    }, 5000);

    return () => clearInterval(interval);
  }, [searchQuery, selectedType]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (tokenId: string) => {
    setRecentlyLiked(tokenId);
    setTimeout(() => setRecentlyLiked(null), 1000);

    setFavorites(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const handleBuyClick = (token: any) => {
    setSelectedToken(token);
    setShowBuyDialog(true);
  };

  const formatHBAR = (value: number | undefined) => {
    const safeValue = value ?? 0;
    return `${safeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ℏ`;
  };

  const formatUSD = (value: number | undefined) => {
    const safeValue = value ?? 0;
    return `$${safeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-[#11190c]/5">
      <ImagePreloader images={preloadedImages} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bricolage font-semibold text-[#11190c]">NSE Marketplace</h2>
            <p className="text-gray-600 mt-1">Discover and trade tokenized securities</p>
          </div>
          <button
            onClick={() => setShowListDialog(true)}
            className="flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-4 py-2 rounded-xl hover:bg-[#11190c]/90 transition-colors"
          >
            <Store className="h-5 w-5" />
            List Token
          </button>
        </div>

        <ListTokenDialog 
          open={showListDialog} 
          onOpenChange={setShowListDialog} 
        />

        <BuyTokenDialog
          open={showBuyDialog}
          onOpenChange={setShowBuyDialog}
          token={selectedToken}
        />

        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, symbol, ISIN, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#11190c] focus:border-transparent bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'bond' | 'asset')}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#11190c] focus:border-transparent bg-gray-50"
            >
              <option value="all">All Types</option>
              <option value="bond">Bonds</option>
              <option value="asset">Assets</option>
            </select>
          </div>
        </div>

        {listedTokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 bg-white rounded-xl shadow-sm">
            <Store className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Listed Assets Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchQuery || selectedType !== 'all'
                ? "No assets match your search criteria. Try adjusting your filters."
                : "There are currently no assets listed on the NSE marketplace."}
            </p>
            <button
              onClick={() => setShowListDialog(true)}
              className="bg-[#11190c] text-[#e6ff00] px-6 py-2 rounded-xl hover:bg-[#11190c]/90 transition-colors"
            >
              List Token
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {listedTokens.map((token) => (
                <motion.div
                  key={token.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={token.imageUrl}
                      alt={token.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                    
                    <div className="absolute top-3 left-3">
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-medium",
                          token.type === 'bond' 
                            ? "bg-blue-500/20 text-blue-50"
                            : "bg-purple-500/20 text-purple-50"
                        )}
                      >
                        {token.type === 'bond' ? 'Bond' : 'Stock'}
                      </motion.span>
                    </div>

                    <motion.div 
                      className="absolute top-3 right-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                        (token.change24h || 0) > 0 
                          ? "bg-green-500/20 text-green-50"
                          : "bg-red-500/20 text-red-50"
                      )}>
                        {(token.change24h || 0) > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(token.change24h || 0)}%
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{token.name}</h3>
                        <p className="text-sm text-gray-500">
                          {token.symbol} • {token.sector}
                        </p>
                      </div>
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(token.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Heart 
                            className={cn(
                              "h-5 w-5 transition-colors duration-300",
                              favorites.includes(token.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            )} 
                          />
                        </motion.button>
                        <AnimatePresence>
                          {recentlyLiked === token.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute -top-1 -right-1"
                            >
                              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                      <Package className="h-4 w-4" />
                      <span>
                        {token.availableSupply?.toLocaleString()} / {token.totalSupply.toLocaleString()} tokens available
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Current Price</p>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-[#11190c]">
                            {formatHBAR(token.priceHBAR)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatUSD(token.priceUSD)}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBuyClick(token)}
                        className="bg-[#11190c] text-[#e6ff00] px-4 py-1.5 rounded-lg hover:bg-[#11190c]/90 transition-colors"
                      >
                        Buy
                      </motion.button>
                    </div>

                    <div className="h-20 mb-4">
                      {token.chart7d && (
                        <div className="w-full h-full flex items-end justify-between">
                          {token.chart7d.map((value: number, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${(value / Math.max(...token.chart7d)) * 100}%` }}
                              className={cn(
                                "w-[8%] rounded-t",
                                (token.change24h || 0) > 0 ? "bg-green-500/20" : "bg-red-500/20"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Market Cap</p>
                          <p className="font-medium text-gray-900">
                            {formatHBAR(token.marketCapHBAR)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatUSD(token.marketCapUSD)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">24h Volume</p>
                          <p className="font-medium text-gray-900">
                            {formatHBAR(token.volume24hHBAR)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatUSD(token.volume24hUSD)}
                          </p>
                        </div>
                        <div className="col-span-2 mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Supply Available</span>
                            <span>
                              {((token.availableSupply / token.totalSupply) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#11190c] rounded-full"
                              style={{ 
                                width: `${(token.availableSupply / token.totalSupply) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}