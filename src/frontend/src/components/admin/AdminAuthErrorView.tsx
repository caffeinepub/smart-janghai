import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface AdminAuthErrorViewProps {
  onRetry: () => void;
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
  errorMessage?: string;
}

export default function AdminAuthErrorView({ onRetry, onNavigate, errorMessage }: AdminAuthErrorViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>
            We encountered an error while verifying your admin access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={onRetry}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            
            <Button
              onClick={() => onNavigate('home')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
