import { useState, useEffect, useMemo } from 'react';
import { useGetPollStatus, useGetPollResults, useVote } from '@/hooks/livePoll';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/admin/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Clock, CheckCircle2, XCircle, AlertCircle, Lock, AlertTriangle } from 'lucide-react';
import { formatTimeRemaining, getTimeRemaining } from '@/utils/time';
import { normalizePollError, isPollAuthError } from '@/utils/pollErrors';
import LivePollResultsChart from './LivePollResultsChart';
import LivePollAdminPanel from './LivePollAdminPanel';

export default function LivePollWidget() {
  const { identity } = useInternetIdentity();
  const { data: statusData, isLoading: statusLoading, isError: statusError, error: statusErrorObj } = useGetPollStatus();
  const { data: resultsData, isLoading: resultsLoading, isError: resultsError, error: resultsErrorObj } = useGetPollResults();
  const voteMutation = useVote();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();

  const [countdown, setCountdown] = useState<string>('');
  const [votedCandidate, setVotedCandidate] = useState<string | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const poll = statusData?.poll ?? null;
  const pollStatus = statusData?.status ?? 'expired';
  const candidates = resultsData?.candidates ?? null;
  const isOngoing = pollStatus === 'ongoing';

  // Update countdown every second
  useEffect(() => {
    if (!poll?.endTime || pollStatus !== 'ongoing') {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      setCountdown(formatTimeRemaining(poll.endTime!));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [poll?.endTime, pollStatus]);

  const handleVote = async (candidateName: string) => {
    try {
      const result = await voteMutation.mutateAsync(candidateName);
      if (result === 'Vote successful') {
        setVotedCandidate(candidateName);
      }
    } catch (error) {
      // Error is handled by mutation state
    }
  };

  // Memoize chart data for smooth animations
  const chartData = useMemo(() => {
    if (!candidates) return [];
    return candidates.map((c) => ({
      name: c.name,
      votes: Number(c.votes),
    }));
  }, [candidates]);

  // Show loading state
  if (statusLoading || resultsLoading) {
    return (
      <Card className="border-2 border-poll-border bg-poll-bg">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Show error state for poll status query failure
  if (statusError) {
    return (
      <Card className="border-2 border-destructive/50 bg-poll-bg">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Failed to load poll status. {statusErrorObj instanceof Error ? statusErrorObj.message : 'Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show error state for poll results query failure
  if (resultsError) {
    return (
      <Card className="border-2 border-destructive/50 bg-poll-bg">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Failed to load poll results. {resultsErrorObj instanceof Error ? resultsErrorObj.message : 'Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show "No Active Poll" state
  if (!poll) {
    return (
      <Card className="border-2 border-poll-border bg-poll-bg">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Vote className="w-16 h-16 mx-auto mb-4 text-poll-muted" />
            <p className="text-lg font-semibold text-poll-foreground mb-2">
              No Active Poll
            </p>
            <p className="text-sm text-poll-muted">
              {isAdmin ? 'Create a poll using the admin panel below.' : 'Check back soon for upcoming polls!'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeRemaining = poll.endTime ? getTimeRemaining(poll.endTime) : null;
  const showVotingClosed = !isOngoing || (timeRemaining?.isExpired ?? false);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-poll-border bg-poll-bg shadow-lg">
        <CardHeader className="border-b border-poll-border/50 bg-poll-header">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Vote className="w-7 h-7 text-poll-accent" />
              <CardTitle className="text-2xl font-bold text-poll-foreground">
                Live Poll
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              {showVotingClosed ? (
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  <XCircle className="w-4 h-4 mr-1" />
                  Voting Closed
                </Badge>
              ) : (
                <Badge className="bg-poll-accent text-poll-accent-foreground text-sm px-3 py-1">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Voting Open
                </Badge>
              )}
            </div>
          </div>
          {poll.endTime && !showVotingClosed && (
            <div className="flex items-center gap-2 mt-3 text-poll-muted">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{countdown}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Authentication warning */}
          {!isAuthenticated && (
            <Alert className="border-poll-accent/50 bg-poll-accent/10">
              <Lock className="w-4 h-4 text-poll-accent" />
              <AlertDescription className="text-poll-foreground">
                You must be logged in with Internet Identity to vote.
              </AlertDescription>
            </Alert>
          )}

          {/* Vote error */}
          {voteMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {normalizePollError(voteMutation.error)}
              </AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {votedCandidate && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your vote for <strong>{votedCandidate}</strong> has been recorded!
              </AlertDescription>
            </Alert>
          )}

          {/* Candidates list */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-poll-foreground">Candidates</h3>
            {candidates && candidates.length > 0 ? (
              <div className="space-y-2">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.name}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-poll-border bg-poll-card hover:border-poll-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-poll-foreground">{candidate.name}</p>
                      <p className="text-sm text-poll-muted">
                        {candidate.votes.toString()} {Number(candidate.votes) === 1 ? 'vote' : 'votes'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleVote(candidate.name)}
                      disabled={
                        !isAuthenticated ||
                        showVotingClosed ||
                        voteMutation.isPending ||
                        !!votedCandidate
                      }
                      className="bg-poll-accent hover:bg-poll-accent/90 text-poll-accent-foreground"
                    >
                      {voteMutation.isPending ? 'Voting...' : 'Vote'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-poll-muted text-center py-4">No candidates available</p>
            )}
          </div>

          {/* Chart */}
          {candidates && candidates.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-poll-foreground mb-4">Results</h3>
              <LivePollResultsChart data={chartData} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin panel */}
      {!adminLoading && isAdmin && <LivePollAdminPanel />}
    </div>
  );
}
