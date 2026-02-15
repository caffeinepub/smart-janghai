import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Loader2 } from 'lucide-react';
import SiteLayout from '@/components/site/SiteLayout';

interface AdminLoginPageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const { login, loginStatus, identity, isLoginError } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      onNavigate('admin-dashboard');
    }
  }, [identity, onNavigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const isLoading = loginStatus === 'logging-in';

  return (
    <SiteLayout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Card className="w-full max-w-md shadow-soft">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Sign in with Internet Identity to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoginError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Login failed. Please try again.
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <Button
                variant="link"
                onClick={() => onNavigate('home')}
                className="text-sm"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
