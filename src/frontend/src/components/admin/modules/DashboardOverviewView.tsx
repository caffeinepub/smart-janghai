import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardMetrics, useGetRecentActivity } from '@/hooks/admin/dashboard';
import { Users, Newspaper, Briefcase, FileText, RefreshCw } from 'lucide-react';
import { ActivityType } from '@/backend';

export default function DashboardOverviewView() {
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useGetDashboardMetrics();
  const { data: recentActivity, isLoading: activityLoading, refetch: refetchActivity } = useGetRecentActivity(10);

  const handleRefresh = () => {
    refetchMetrics();
    refetchActivity();
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const getActivityTypeLabel = (type: ActivityType): string => {
    const labels: Record<ActivityType, string> = {
      [ActivityType.userCreated]: 'User Created',
      [ActivityType.userUpdated]: 'User Updated',
      [ActivityType.newsCreated]: 'News Created',
      [ActivityType.newsUpdated]: 'News Updated',
      [ActivityType.newsPublished]: 'News Published',
      [ActivityType.newsDeleted]: 'News Deleted',
      [ActivityType.schemeCreated]: 'Scheme Created',
      [ActivityType.schemeUpdated]: 'Scheme Updated',
      [ActivityType.schemeDeleted]: 'Scheme Deleted',
      [ActivityType.jobCreated]: 'Job Created',
      [ActivityType.jobUpdated]: 'Job Updated',
      [ActivityType.jobDeleted]: 'Job Deleted',
      [ActivityType.mediaUploaded]: 'Media Uploaded',
      [ActivityType.mediaDeleted]: 'Media Deleted',
      [ActivityType.notificationCreated]: 'Notification Created',
      [ActivityType.settingsUpdated]: 'Settings Updated',
      [ActivityType.backupExported]: 'Backup Exported',
      [ActivityType.csvExported]: 'CSV Exported',
      [ActivityType.roleChanged]: 'Role Changed',
      [ActivityType.userStatusChanged]: 'User Status Changed',
      [ActivityType.login]: 'Login',
      [ActivityType.logout]: 'Logout',
    };
    return labels[type] || type;
  };

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers.toString() || '0'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total News</CardTitle>
            <Newspaper className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalNews.toString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.publishedNews.toString() || '0'} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalJobs.toString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.activeJobs.toString() || '0'} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Schemes</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalSchemes.toString() || '0'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <Badge variant="outline" className="mt-1">
                    {getActivityTypeLabel(activity.activityType)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
