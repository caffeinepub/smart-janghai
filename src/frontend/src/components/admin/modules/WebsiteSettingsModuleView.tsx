import { useState } from 'react';
import WebsiteSettingsForm from '../settings/WebsiteSettingsForm';
import LogoPickerDialog from '../settings/LogoPickerDialog';
import { useGetWebsiteSettings } from '@/hooks/admin/settings';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function WebsiteSettingsModuleView() {
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);
  const { data: settings, isLoading } = useGetWebsiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
        <p className="text-muted-foreground mt-1">Configure website information and branding</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ) : (
        <WebsiteSettingsForm
          settings={settings ?? null}
          onOpenLogoPicker={() => setIsLogoPickerOpen(true)}
        />
      )}

      <LogoPickerDialog
        open={isLogoPickerOpen}
        onOpenChange={setIsLogoPickerOpen}
        currentLogoId={settings?.logo ?? null}
      />
    </div>
  );
}
