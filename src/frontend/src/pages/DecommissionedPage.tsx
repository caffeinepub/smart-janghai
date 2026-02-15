import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function DecommissionedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Website Decommissioned</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            This website has been permanently decommissioned and is no longer available.
          </p>
          <p className="text-muted-foreground">
            All services and data associated with this site have been discontinued.
            Thank you for your understanding.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
