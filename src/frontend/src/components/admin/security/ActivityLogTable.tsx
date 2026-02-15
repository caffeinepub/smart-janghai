import { useGetAdminActivities } from '@/hooks/admin/security';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActivityLogTable() {
  const { data: activities, isLoading } = useGetAdminActivities();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No activity logs available
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {new Date(Number(activity.time) / 1000000).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {activity.principal.toString().slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {activity.activityType.replace(/([A-Z])/g, ' $1').trim()}
                    </TableCell>
                    <TableCell className="text-sm">{activity.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
