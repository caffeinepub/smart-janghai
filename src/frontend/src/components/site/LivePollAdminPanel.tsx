import { useState } from 'react';
import { useCreateOrUpdatePoll, useResetPoll } from '@/hooks/livePoll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { millisToNanos } from '@/utils/time';

export default function LivePollAdminPanel() {
  const createOrUpdateMutation = useCreateOrUpdatePoll();
  const resetMutation = useResetPoll();

  const [candidates, setCandidates] = useState<string[]>(['']);
  const [duration, setDuration] = useState<string>('60');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCandidateChange = (index: number, value: string) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const handleCreateOrUpdate = async () => {
    setSuccessMessage('');
    const validCandidates = candidates.filter((c) => c.trim() !== '');

    if (validCandidates.length === 0) {
      return;
    }

    const durationMinutes = parseInt(duration, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      return;
    }

    const endTime = millisToNanos(Date.now() + durationMinutes * 60 * 1000);

    try {
      await createOrUpdateMutation.mutateAsync({
        candidates: validCandidates,
        endTime,
      });
      setSuccessMessage('Poll created/updated successfully!');
      setCandidates(['']);
      setDuration('60');
    } catch (error) {
      // Error handled by mutation state
    }
  };

  const handleReset = async () => {
    setSuccessMessage('');
    try {
      await resetMutation.mutateAsync();
      setSuccessMessage('Poll reset successfully!');
      setCandidates(['']);
      setDuration('60');
    } catch (error) {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-2 border-poll-border bg-poll-bg">
      <CardHeader className="border-b border-poll-border/50 bg-poll-header">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-poll-accent" />
          <CardTitle className="text-xl font-bold text-poll-foreground">
            Admin Poll Controls
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Success message */}
        {successMessage && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error messages */}
        {createOrUpdateMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Failed to create/update poll: {createOrUpdateMutation.error instanceof Error ? createOrUpdateMutation.error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {resetMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Failed to reset poll: {resetMutation.error instanceof Error ? resetMutation.error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {/* Candidates */}
        <div className="space-y-3">
          <Label className="text-poll-foreground font-semibold">Candidates</Label>
          {candidates.map((candidate, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={candidate}
                onChange={(e) => handleCandidateChange(index, e.target.value)}
                placeholder={`Candidate ${index + 1}`}
                className="border-poll-border bg-poll-card text-poll-foreground"
              />
              {candidates.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveCandidate(index)}
                  className="border-poll-border hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={handleAddCandidate}
            className="w-full border-poll-border hover:bg-poll-accent/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-poll-foreground font-semibold">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            placeholder="60"
            className="border-poll-border bg-poll-card text-poll-foreground"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleCreateOrUpdate}
            disabled={
              createOrUpdateMutation.isPending ||
              candidates.filter((c) => c.trim() !== '').length === 0 ||
              !duration ||
              parseInt(duration, 10) <= 0
            }
            className="flex-1 bg-poll-accent hover:bg-poll-accent/90 text-poll-accent-foreground"
          >
            {createOrUpdateMutation.isPending ? 'Saving...' : 'Create/Update Poll'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? 'Resetting...' : 'Reset Poll'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Poll?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete the current poll and all votes. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
