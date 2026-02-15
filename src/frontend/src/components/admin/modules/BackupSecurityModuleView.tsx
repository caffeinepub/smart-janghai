import BackupDownloadCard from '../security/BackupDownloadCard';
import ActivityLogTable from '../security/ActivityLogTable';
import LoginHistoryTable from '../security/LoginHistoryTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BackupSecurityModuleView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backup & Security</h1>
        <p className="text-muted-foreground mt-1">Manage backups and view activity logs</p>
      </div>

      <BackupDownloadCard />

      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="login">Login History</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-6">
          <ActivityLogTable />
        </TabsContent>
        <TabsContent value="login" className="mt-6">
          <LoginHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
