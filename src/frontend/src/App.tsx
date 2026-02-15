import { useState } from 'react';
import HomePage from './pages/HomePage';
import MemberLoginPage from './pages/MemberLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AppErrorBoundary from './components/app/AppErrorBoundary';

type PageType = 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <MemberLoginPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <UserDashboardPage onNavigate={setCurrentPage} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppErrorBoundary>
      {renderPage()}
    </AppErrorBoundary>
  );
}
