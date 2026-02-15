import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllUsers } from '@/hooks/admin/users';
import { useGetAllNews } from '@/hooks/admin/news';
import { useGetAllSchemes } from '@/hooks/admin/schemes';
import { useGetAllJobs } from '@/hooks/admin/jobs';
import { Users, Newspaper, Building2, Briefcase, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardOverviewView() {
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsers();
  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useGetAllNews();
  const { data: schemes, isLoading: schemesLoading, refetch: refetchSchemes } = useGetAllSchemes();
  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useGetAllJobs();

  const handleRefreshAll = () => {
    refetchUsers();
    refetchNews();
    refetchSchemes();
    refetchJobs();
  };

  const stats = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      loading: usersLoading,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'News Posts',
      value: news?.length || 0,
      icon: Newspaper,
      loading: newsLoading,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Government Schemes',
      value: schemes?.length || 0,
      icon: Building2,
      loading: schemesLoading,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Job Posts',
      value: jobs?.length || 0,
      icon: Briefcase,
      loading: jobsLoading,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome to the SMART JANGHAI admin dashboard</p>
        </div>
        <Button onClick={handleRefreshAll} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity tracking is available in the Backup & Security section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
