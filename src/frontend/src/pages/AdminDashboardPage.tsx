import AdminRouteGuard from '@/components/admin/AdminRouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface AdminDashboardPageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  return (
    <AdminRouteGuard onNavigate={onNavigate}>
      <DashboardLayout onNavigate={onNavigate} isAdminMode={true} />
    </AdminRouteGuard>
  );
}
