import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [currentWord, setCurrentWord] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);

  const words = ['Securities', 'Assets', 'Future'];
  const backgroundImages = [
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a6?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1639815188546-c43c240ff451?q=80&w=2832&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
  ];

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(wordInterval);
  }, []);

  const dispatchStorageEvent = () => {
    window.dispatchEvent(new Event('custom-storage'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      dispatchStorageEvent();
      
      setIsRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', 'demo@example.com');
      dispatchStorageEvent();
      
      setIsRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = '/dashboard';
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (isRedirecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#11190c]">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-[#e6ff00] border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <h2 className="text-2xl font-bricolage font-bold text-[#e6ff00] mb-4">
            Building Your Dashboard
          </h2>
          <p className="text-[#e6ff00]/80">
            Please wait while we prepare your personalized experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Left Section - Hero Content */}
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden bg-[#11190c]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImages[currentBg]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.2) contrast(1.1)'
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#11190c]/30 to-[#11190c]/70" />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-12">
          <h1 className="font-bricolage text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-white mb-6">
            <span className="block">Your Gateway</span>
            <span className="block">to Tokenized</span>
            <div className="relative inline-block mt-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[#11190c] bg-[#e6ff00] px-3 md:px-4 py-1 rounded-lg inline-block"
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>

          <div className="flex flex-col space-y-4 mt-8">
            <button 
              onClick={() => setIsLogin(false)}
              disabled={isLoading}
              className="w-full bg-[#e6ff00] text-[#11190c] py-3 px-6 rounded-full font-medium hover:bg-[#e6ff00]/90 transition-all duration-300 disabled:opacity-50"
            >
              Create account
            </button>
            <button 
              onClick={() => setIsLogin(true)}
              disabled={isLoading}
              className="w-full border border-[#e6ff00]/20 text-[#e6ff00] py-3 px-6 rounded-full hover:bg-[#e6ff00]/5 transition-all duration-300 disabled:opacity-50"
            >
              Already have a CSD account
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="flex-1 bg-white p-6 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="font-bricolage text-2xl font-bold text-[#11190c] mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="font-inter text-gray-600">
                  {isLogin ? 'Sign in to your AssetraCSD account' : 'Start your journey with AssetraCSD'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#e6ff00] focus:border-transparent transition-all duration-300 font-inter"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#e6ff00] focus:border-transparent transition-all duration-300 font-inter"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 text-[#e6ff00] focus:ring-[#e6ff00] border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-inter">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button"
                      className="text-sm font-medium text-[#11190c] hover:text-[#e6ff00] transition-colors duration-300"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#11190c] text-[#e6ff00] py-2 px-6 rounded-full hover:bg-[#11190c]/90 transition-all duration-300 font-medium disabled:opacity-50 relative"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#e6ff00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isLogin ? 'Sign in' : 'Create account'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full border border-[#11190c] text-[#11190c] py-2 px-6 rounded-full hover:bg-gray-50 transition-all duration-300 font-medium disabled:opacity-50"
                >
                  Skip for now
                </button>

                <p className="text-center text-sm text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    disabled={isLoading}
                    className="text-[#11190c] font-medium hover:text-[#e6ff00] transition-colors duration-300 disabled:opacity-50"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}