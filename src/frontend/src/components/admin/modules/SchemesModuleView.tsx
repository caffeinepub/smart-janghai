import { useState } from 'react';
import SchemesList from '../schemes/SchemesList';
import SchemeForm from '../schemes/SchemeForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { Scheme } from '@/backend';

export default function SchemesModuleView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

  const handleClose = () => {
    setIsCreateOpen(false);
    setEditingScheme(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
          <p className="text-muted-foreground mt-1">Manage government schemes and programs</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Scheme
        </Button>
      </div>

      <SchemesList onEdit={setEditingScheme} />

      <Dialog open={isCreateOpen || !!editingScheme} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingScheme ? 'Edit Scheme' : 'Create Scheme'}</DialogTitle>
          </DialogHeader>
          <SchemeForm scheme={editingScheme} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
