import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, ChevronDown, User, Menu, X, Store, PlusCircle, Wallet, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const connectTimeout = useRef<number>();

  useEffect(() => {
    const initializeLayout = async () => {
      setIsLoading(true);
      const email = localStorage.getItem('userEmail');
      const profile = localStorage.getItem('userProfile');
      
      if (!email) {
        navigate('/auth', { replace: true });
        return;
      }

      setUserEmail(email);
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
      await checkWalletConnection();
      setIsLoading(false);
    };

    initializeLayout();

    return () => {
      if (connectTimeout.current) {
        window.clearTimeout(connectTimeout.current);
      }
    };
  }, [navigate]);

  const checkWalletConnection = async () => {
    if (isConnecting || isChecking || typeof window.ethereum === 'undefined') {
      setWalletAddress(null);
      return;
    }

    setIsChecking(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        if (connectTimeout.current) {
          window.clearTimeout(connectTimeout.current);
          connectTimeout.current = undefined;
        }
        setError(null);
      } else {
        setWalletAddress(null);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletAddress(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleConnectWallet = async () => {
    if (isConnecting || isChecking || typeof window.ethereum === 'undefined') return;
    if (connectTimeout.current) return;

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        return;
      }

      // Set a timeout to prevent rapid reconnection attempts
      connectTimeout.current = window.setTimeout(() => {
        connectTimeout.current = undefined;
      }, 2000);

      const newAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (newAccounts.length > 0) {
        setWalletAddress(newAccounts[0]);
        setError(null);
        // Clear timeout after successful connection
        if (connectTimeout.current) {
          window.clearTimeout(connectTimeout.current);
          connectTimeout.current = undefined;
        }
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      if (err.code === -32002) {
        setError('Please check MetaMask to complete the connection.');
      } else if (err.code === 4001) {
        setError('You rejected the connection request.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
      // Clear timeout on error
      if (connectTimeout.current) {
        window.clearTimeout(connectTimeout.current);
        connectTimeout.current = undefined;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    localStorage.clear();
    window.dispatchEvent(new Event('custom-storage'));
    navigate('/auth', { replace: true });
  };

  const getInitials = (email: string) => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-2 border-[#11190c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg border border-gray-100 lg:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative lg:block w-72 h-screen bg-white shadow-lg z-40",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-bricolage text-xl font-bold bg-gradient-to-r from-[#11190c] to-[#1a2912] bg-clip-text text-transparent">
                Assetra
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#11190c] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#11190c] text-[#e6ff00]'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              Onboarding
            </NavLink>

            <NavLink
              to="/dashboard/create-token"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#11190c] text-[#e6ff00]'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              <PlusCircle className="h-5 w-5" />
              Create Token
            </NavLink>

            <NavLink
              to="/dashboard/portfolio"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#11190c] text-[#e6ff00]'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              <Wallet className="h-5 w-5" />
              Portfolio
            </NavLink>

            <NavLink
              to="/dashboard/marketplace"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#11190c] text-[#e6ff00]'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              <Store className="h-5 w-5" />
              NSE Marketplace
            </NavLink>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100">
            <motion.div 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer relative"
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-[#11190c] rounded-xl flex items-center justify-center text-[#e6ff00] font-medium">
                {userEmail ? getInitials(userEmail) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : userEmail?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {walletAddress ? shortenAddress(walletAddress) : 'No wallet connected'}
                </p>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                showUserMenu && "transform rotate-180"
              )} />
            </motion.div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="space-y-1">
                      {userProfile && (
                        <>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{userProfile.phone}</p>
                          <p className="text-sm text-gray-500 mt-2">Address</p>
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile.street}, {userProfile.building}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile.city}, {userProfile.postalCode}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 ml-12 lg:ml-0">
              <span className="font-bricolage text-xl font-semibold bg-gradient-to-r from-[#11190c] to-[#1a2912] bg-clip-text text-transparent">
                Built with Hedera
              </span>
            </div>

            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {typeof window.ethereum === 'undefined' ? (
                <motion.a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-4 py-2 rounded-xl hover:bg-[#11190c]/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Wallet className="h-4 w-4" />
                  Install MetaMask
                </motion.a>
              ) : walletAddress ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 py-2 bg-[#11190c]/5 rounded-xl text-sm font-medium text-[#11190c]"
                >
                  {shortenAddress(walletAddress)}
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleConnectWallet}
                  disabled={isConnecting || isChecking || Boolean(connectTimeout.current)}
                  className="flex items-center gap-2 bg-[#11190c] text-[#e6ff00] px-4 py-2 rounded-xl hover:bg-[#11190c]/90 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnecting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#e6ff00]"></span>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </motion.button>
              )}

              <motion.button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}