import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VotingResult } from '@/backend';

export function useGetAllVotingResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VotingResult[]>({
    queryKey: ['votingResults'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllVotingResults();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds for live updates
    retry: 2,
  });
}
