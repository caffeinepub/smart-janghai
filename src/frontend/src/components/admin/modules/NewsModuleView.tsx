import { useState } from 'react';
import NewsList from '../news/NewsList';
import NewsForm from '../news/NewsForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { News } from '@/backend';

export default function NewsModuleView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const handleClose = () => {
    setIsCreateOpen(false);
    setEditingNews(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage News</h1>
          <p className="text-muted-foreground mt-1">Create and manage news articles</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>

      <NewsList onEdit={setEditingNews} />

      <Dialog open={isCreateOpen || !!editingNews} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Edit News' : 'Create News'}</DialogTitle>
          </DialogHeader>
          <NewsForm news={editingNews} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
