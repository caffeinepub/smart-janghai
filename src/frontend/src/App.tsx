import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import MemberLoginPage from './pages/MemberLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DecommissionedPage from './pages/DecommissionedPage';
import AppErrorBoundary from './components/app/AppErrorBoundary';
import { parseHashToPage, setPageHash, type PageType } from './utils/hashRouting';
import { useSystemStatus } from './hooks/useSystemStatus';

export default function App() {
  // Initialize from URL hash
  const [currentPage, setCurrentPage] = useState<PageType>(() => parseHashToPage());

  // Check decommission status
  const { data: systemStatus, isLoading: statusLoading, isFetched: statusFetched } = useSystemStatus();
  const isDecommissioned = systemStatus?.isDecommissioned ?? false;

  // Listen to hash changes (browser back/forward, manual hash edits)
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = parseHashToPage();
      setCurrentPage(newPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state with URL on mount and when URL changes outside of hashchange
  useEffect(() => {
    const syncWithURL = () => {
      const urlPage = parseHashToPage();
      if (urlPage !== currentPage) {
        setCurrentPage(urlPage);
      }
    };

    // Check on mount
    syncWithURL();

    // Also check periodically to catch any edge cases
    const interval = setInterval(syncWithURL, 100);
    return () => clearInterval(interval);
  }, [currentPage]);

  // Centralized navigation handler that updates both state and URL hash
  const handleNavigate = (page: PageType) => {
    setPageHash(page);
    setCurrentPage(page);
  };

  const renderPage = () => {
    // Show loading state while checking decommission status
    if (statusLoading || !statusFetched) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    // If decommissioned, always show decommissioned page regardless of route
    if (isDecommissioned) {
      return <DecommissionedPage />;
    }

    // Normal routing when not decommissioned
    switch (currentPage) {
      case 'login':
        return <MemberLoginPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <UserDashboardPage onNavigate={handleNavigate} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppErrorBoundary>
      {renderPage()}
    </AppErrorBoundary>
  );
}
