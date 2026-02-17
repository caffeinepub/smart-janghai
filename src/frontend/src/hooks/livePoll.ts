import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LivePoll, PollStatus, PollCandidate } from '@/backend';

export function useGetPollStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ poll: LivePoll | null; status: PollStatus }>({
    queryKey: ['pollStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getPollStatus();
      return {
        poll: result.poll ?? null,
        status: result.status,
      };
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: (query) => {
      // Poll every 5 seconds if ongoing, every 30 seconds if expired
      if (!query.state.data) return 5000;
      return query.state.data.status === 'ongoing' ? 5000 : 30000;
    },
    retry: 2,
  });
}

export function useGetPollResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ candidates: PollCandidate[] | null; status: PollStatus }>({
    queryKey: ['pollResults'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getPollResults();
      return {
        candidates: result.candidates ?? null,
        status: result.status,
      };
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: (query) => {
      // Poll every 3 seconds if ongoing, every 30 seconds if expired
      if (!query.state.data) return 3000;
      return query.state.data.status === 'ongoing' ? 3000 : 30000;
    },
    retry: 2,
  });
}

export function useVote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidateName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.vote(candidateName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollResults'] });
      queryClient.invalidateQueries({ queryKey: ['pollStatus'] });
    },
  });
}

export function useCreateOrUpdatePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ candidates, endTime }: { candidates: string[]; endTime: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdatePoll(candidates, endTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollStatus'] });
      queryClient.invalidateQueries({ queryKey: ['pollResults'] });
    },
  });
}

export function useResetPoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.resetPoll();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollStatus'] });
      queryClient.invalidateQueries({ queryKey: ['pollResults'] });
    },
  });
}
