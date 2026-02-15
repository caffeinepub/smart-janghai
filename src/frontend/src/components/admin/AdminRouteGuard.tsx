import { ReactNode, useEffect } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/admin/useAdminAuth';
import AccessDeniedView from './AccessDeniedView';
import AdminAuthErrorView from './AdminAuthErrorView';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { normalizeAuthError } from '@/utils/adminAuthError';

interface AdminRouteGuardProps {
  children: ReactNode;
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function AdminRouteGuard({ children, onNavigate }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading, isFetched, isError, error, refetch } = useIsCallerAdmin();

  // Redirect to login if not authenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!isInitializing && !isLoading && isFetched && !identity) {
      onNavigate('admin-login');
    }
  }, [identity, isInitializing, isLoading, isFetched, onNavigate]);

  // Redirect non-admin users to access denied or appropriate page
  useEffect(() => {
    if (!isInitializing && !isLoading && isFetched && identity && isAdmin === false) {
      // User is authenticated but not admin - stay on current page to show AccessDeniedView
      // The URL hash will already be admin-dashboard, which is correct for this error state
    }
  }, [identity, isInitializing, isLoading, isFetched, isAdmin, onNavigate]);

  // Show loading while checking authentication
  if (isInitializing || isLoading || !isFetched) {
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

  // Show error view if admin check failed
  if (isError) {
    return (
      <AdminAuthErrorView
        onRetry={() => refetch()}
        onNavigate={onNavigate}
        errorMessage={normalizeAuthError(error)}
      />
    );
  }

  // Return null while redirecting (useEffect handles navigation)
  if (!identity) {
    return null;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return <AccessDeniedView onNavigate={onNavigate} />;
  }

  return <>{children}</>;
}
