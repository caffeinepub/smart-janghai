import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface UserDashboardPageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function UserDashboardPage({ onNavigate }: UserDashboardPageProps) {
  return <DashboardLayout onNavigate={onNavigate} isAdminMode={false} />;
}
