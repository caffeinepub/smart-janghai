import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
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
  });
}

export function useCreateVotingResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { village: string; candidate: string; votes: number }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createVotingResult(data.village, data.candidate, BigInt(data.votes));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votingResults'] });
    },
  });
}

export function useUpdateVotingResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; village: string; candidate: string; votes: number }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateVotingResult(data.id, data.village, data.candidate, BigInt(data.votes));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votingResults'] });
    },
  });
}

export function useDeleteVotingResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteVotingResult(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votingResults'] });
    },
  });
}
