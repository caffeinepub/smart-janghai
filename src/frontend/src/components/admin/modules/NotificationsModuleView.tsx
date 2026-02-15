import NotificationComposer from '../notifications/NotificationComposer';
import NotificationsHistoryList from '../notifications/NotificationsHistoryList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationsModuleView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">Send notifications to users</p>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="compose" className="mt-6">
          <NotificationComposer />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <NotificationsHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
