import { useState } from 'react';
import VotingResultsList from '../voting-results/VotingResultsList';
import VotingResultFormDialog from '../voting-results/VotingResultFormDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { VotingResult } from '@/backend';

export default function VotingResultsModuleView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<VotingResult | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voting Results</h1>
          <p className="text-muted-foreground mt-1">Manage Gram Pradhan voting results for villages around Janghai</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Result
        </Button>
      </div>

      <VotingResultsList onEdit={setEditingResult} />

      <VotingResultFormDialog
        open={isCreateOpen || !!editingResult}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingResult(null);
          }
        }}
        result={editingResult}
      />
    </div>
  );
}
