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

  // Check decommission status (non-blocking)
  const { data: systemStatus } = useSystemStatus();
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

  // Sync state with URL on mount only
  useEffect(() => {
    const urlPage = parseHashToPage();
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Centralized navigation handler that updates both state and URL hash
  const handleNavigate = (page: PageType) => {
    setPageHash(page);
    setCurrentPage(page);
  };

  const renderPage = () => {
    // If decommissioned, always show decommissioned page regardless of route
    if (isDecommissioned) {
      return <DecommissionedPage />;
    }

    // Normal routing when not decommissioned (fail-open: render immediately)
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
