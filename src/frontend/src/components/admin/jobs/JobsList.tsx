import { useState } from 'react';
import { useGetAllJobs, useDeleteJob } from '@/hooks/admin/jobs';
import AdminDataTable from '../common/AdminDataTable';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Job } from '@/backend';

interface JobsListProps {
  onEdit: (job: Job) => void;
}

export default function JobsList({ onEdit }: JobsListProps) {
  const { data: jobs, isLoading } = useGetAllJobs();
  const deleteMutation = useDeleteJob();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  const filteredJobs = jobs?.filter((item) =>
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.qualification.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Company',
      accessor: (item: Job) => <span className="font-medium">{item.companyName}</span>,
    },
    {
      header: 'Qualification',
      accessor: (item: Job) => <span className="text-sm">{item.qualification}</span>,
    },
    {
      header: 'Salary',
      accessor: (item: Job) => <span className="text-sm">₹{item.salary.toString()}</span>,
    },
    {
      header: 'Status',
      accessor: (item: Job) => (
        <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="capitalize">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (item: Job) => (
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
            data={filteredJobs}
            columns={columns}
            searchPlaceholder="Search jobs by company or qualification..."
            onSearch={setSearchQuery}
            emptyMessage="No jobs found"
          />
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
