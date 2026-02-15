import { useState } from 'react';
import JobsList from '../jobs/JobsList';
import JobForm from '../jobs/JobForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { Job } from '@/backend';

export default function JobsModuleView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleClose = () => {
    setIsCreateOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
          <p className="text-muted-foreground mt-1">Post and manage job opportunities</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </div>

      <JobsList onEdit={setEditingJob} />

      <Dialog open={isCreateOpen || !!editingJob} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Create Job'}</DialogTitle>
          </DialogHeader>
          <JobForm job={editingJob} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
