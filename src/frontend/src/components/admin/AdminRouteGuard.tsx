import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerRole } from '@/hooks/admin/useAdminAuth';
import { isAdminRole } from '@/utils/userRole';
import AccessDeniedView from './AccessDeniedView';
import AdminAuthErrorView from './AdminAuthErrorView';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AdminRouteGuardProps {
  children: ReactNode;
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function AdminRouteGuard({ children, onNavigate }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: role, isLoading: roleLoading, isFetched, isError, error, refetch } = useGetCallerRole();

  // Show loading while checking authentication
  if (isInitializing || roleLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verifying admin access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error view if role query failed
  if (isError) {
    return (
      <AdminAuthErrorView
        onRetry={() => refetch()}
        onNavigate={onNavigate}
        errorMessage={error instanceof Error ? error.message : 'Failed to verify admin role'}
      />
    );
  }

  // Redirect to login if not authenticated
  if (!identity) {
    onNavigate('admin-login');
    return null;
  }

  // Show access denied if not admin (using the safe role checker)
  if (!isAdminRole(role)) {
    return <AccessDeniedView onNavigate={onNavigate} />;
  }

  return <>{children}</>;
}
