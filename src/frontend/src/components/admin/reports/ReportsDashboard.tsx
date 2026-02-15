import { useGetAllUsers } from '@/hooks/admin/users';
import { useGetAllNews } from '@/hooks/admin/news';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ReportsDashboard() {
  const { data: users } = useGetAllUsers();
  const { data: news } = useGetAllNews();

  const handleExportUsers = () => {
    if (!users) return;

    const csv = [
      ['Name', 'Email', 'Mobile', 'Role', 'Status', 'Registration Date'].join(','),
      ...users.map((u) =>
        [
          u.name,
          u.email,
          u.mobile,
          u.role,
          u.status,
          new Date(Number(u.registrationDate) / 1000000).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportNews = () => {
    if (!news) return;

    const csv = [
      ['Title', 'Category', 'Status', 'Publish Date'].join(','),
      ...news.map((n) =>
        [
          n.title,
          n.category,
          n.status,
          new Date(Number(n.publishDate) / 1000000).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const userGrowthData = users?.length || 0;
  const publishedNewsCount = news?.filter((n) => n.status === 'published').length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userGrowthData}</div>
            <p className="text-sm text-muted-foreground mt-1">Total registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{publishedNewsCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Total published articles</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Users Export</h3>
              <p className="text-sm text-muted-foreground">Download all user data as CSV</p>
            </div>
            <Button onClick={handleExportUsers} disabled={!users || users.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">News Export</h3>
              <p className="text-sm text-muted-foreground">Download all news data as CSV</p>
            </div>
            <Button onClick={handleExportNews} disabled={!news || news.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export News
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View tracking data is not currently available. This feature will display the most popular content once analytics are implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
