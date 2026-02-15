import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedViewProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function AccessDeniedView({ onNavigate }: AccessDeniedViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to access the admin dashboard. Only administrators can view this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => onNavigate('home')}
            className="w-full"
            size="lg"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
