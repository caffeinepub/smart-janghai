import { useState } from 'react';
import { useGetAllSchemes, useDeleteScheme } from '@/hooks/admin/schemes';
import AdminDataTable from '../common/AdminDataTable';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Scheme } from '@/backend';

interface SchemesListProps {
  onEdit: (scheme: Scheme) => void;
}

export default function SchemesList({ onEdit }: SchemesListProps) {
  const { data: schemes, isLoading } = useGetAllSchemes();
  const deleteMutation = useDeleteScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Scheme | null>(null);

  const filteredSchemes = schemes?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Name',
      accessor: (item: Scheme) => <span className="font-medium">{item.name}</span>,
    },
    {
      header: 'Apply Link',
      accessor: (item: Scheme) => (
        <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
          View Link
        </a>
      ),
    },
    {
      header: 'Actions',
      accessor: (item: Scheme) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Edit className="w-4 h-4" />
          </Button>
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
            data={filteredSchemes}
            columns={columns}
            searchPlaceholder="Search schemes by name..."
            onSearch={setSearchQuery}
            emptyMessage="No schemes found"
          />
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Scheme"
        description="Are you sure you want to delete this scheme? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
