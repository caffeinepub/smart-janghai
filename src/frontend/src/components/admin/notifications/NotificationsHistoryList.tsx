import { useGetNotificationsHistory } from '@/hooks/admin/notifications';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function NotificationsHistoryList() {
  const { data: notifications, isLoading } = useGetNotificationsHistory();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No notifications sent yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notif: any) => (
                <TableRow key={notif.id}>
                  <TableCell>{notif.message}</TableCell>
                  <TableCell>{notif.recipients.length} users</TableCell>
                  <TableCell>{new Date(Number(notif.timestamp) / 1000000).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
