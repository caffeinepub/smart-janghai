import { useState } from 'react';
import { useGetAllNews, useDeleteNews, usePublishNews } from '@/hooks/admin/news';
import AdminDataTable from '../common/AdminDataTable';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { News } from '@/backend';

interface NewsListProps {
  onEdit: (news: News) => void;
}

export default function NewsList({ onEdit }: NewsListProps) {
  const { data: news, isLoading } = useGetAllNews();
  const deleteMutation = useDeleteNews();
  const publishMutation = usePublishNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null);

  const filteredNews = news?.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handlePublish = async (item: News) => {
    await publishMutation.mutateAsync(item.id);
  };

  const columns = [
    {
      header: 'Title',
      accessor: (item: News) => <span className="font-medium">{item.title}</span>,
    },
    {
      header: 'Category',
      accessor: (item: News) => <Badge variant="outline">{item.category}</Badge>,
    },
    {
      header: 'Status',
      accessor: (item: News) => (
        <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="capitalize">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (item: News) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Edit className="w-4 h-4" />
          </Button>
          {item.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePublish(item)}
              disabled={publishMutation.isPending}
            >
              <Send className="w-4 h-4 text-green-600" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

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
    <>
      <Card>
        <CardContent className="pt-6">
          <AdminDataTable
            data={filteredNews}
            columns={columns}
            searchPlaceholder="Search news by title or category..."
            onSearch={setSearchQuery}
            emptyMessage="No news found"
          />
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete News"
        description="Are you sure you want to delete this news article? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
