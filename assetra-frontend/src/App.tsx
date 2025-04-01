import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Marketplace from './pages/Marketplace';
import CreateToken from './pages/CreateToken';
import Portfolio from './pages/Portfolio';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('custom-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom-storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-[#11190c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/auth" replace />}
          >
            <Route index element={<Overview />} />
            <Route path="create-token" element={<CreateToken />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="marketplace" element={<Marketplace />} />
          </Route>
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;