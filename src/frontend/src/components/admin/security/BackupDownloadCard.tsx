import { useExportBackup } from '@/hooks/admin/security';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

export default function BackupDownloadCard() {
  const exportMutation = useExportBackup();

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
    } catch (error) {
      console.error('Backup export failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Export</CardTitle>
        <CardDescription>Download a complete snapshot of all system data</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={exportMutation.isPending}>
          {exportMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Backup
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
