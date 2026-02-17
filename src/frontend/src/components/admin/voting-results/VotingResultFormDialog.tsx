import { useState, useEffect } from 'react';
import { useCreateVotingResult, useUpdateVotingResult } from '@/hooks/admin/votingResults';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormErrorText from '../common/FormErrorText';
import { Loader2 } from 'lucide-react';
import type { VotingResult } from '@/backend';

interface VotingResultFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: VotingResult | null;
}

export default function VotingResultFormDialog({ open, onOpenChange, result }: VotingResultFormDialogProps) {
  const [village, setVillage] = useState('');
  const [candidate, setCandidate] = useState('');
  const [votes, setVotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateVotingResult();
  const updateMutation = useUpdateVotingResult();

  useEffect(() => {
    if (result) {
      setVillage(result.village);
      setCandidate(result.candidate);
      setVotes(result.votes.toString());
    } else {
      setVillage('');
      setCandidate('');
      setVotes('');
    }
    setErrors({});
  }, [result, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!village.trim()) {
      newErrors.village = 'Village name is required';
    }
    
    if (!candidate.trim()) {
      newErrors.candidate = 'Candidate name is required';
    }
    
    if (!votes.trim()) {
      newErrors.votes = 'Vote count is required';
    } else {
      const votesNum = parseInt(votes, 10);
      if (isNaN(votesNum) || votesNum < 0) {
        newErrors.votes = 'Vote count must be a non-negative number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const votesNum = parseInt(votes, 10);
      
      if (result) {
        await updateMutation.mutateAsync({
          id: result.id,
          village,
          candidate,
          votes: votesNum,
        });
      } else {
        await createMutation.mutateAsync({
          village,
          candidate,
          votes: votesNum,
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save voting result' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{result ? 'Edit Voting Result' : 'Add Voting Result'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="village">Village Name *</Label>
            <Input
              id="village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Enter village name"
              disabled={isPending}
            />
            <FormErrorText error={errors.village} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate">Candidate Name *</Label>
            <Input
              id="candidate"
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              placeholder="Enter candidate name"
              disabled={isPending}
            />
            <FormErrorText error={errors.candidate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="votes">Vote Count *</Label>
            <Input
              id="votes"
              type="number"
              min="0"
              value={votes}
              onChange={(e) => setVotes(e.target.value)}
              placeholder="Enter vote count"
              disabled={isPending}
            />
            <FormErrorText error={errors.votes} />
          </div>

          {errors.submit && <FormErrorText error={errors.submit} />}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
