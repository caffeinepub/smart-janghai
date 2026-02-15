import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Scheme, SchemeId } from '@/backend';

export function useGetAllSchemes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Scheme[]>({
    queryKey: ['schemes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllSchemes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      eligibilityDetails: string;
      applyLink: string;
      importantDates: string;
      documents: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScheme(
        data.name,
        data.eligibilityDetails,
        data.applyLink,
        data.importantDates,
        data.documents
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
  });
}

export function useUpdateScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: SchemeId;
      name: string;
      eligibilityDetails: string;
      applyLink: string;
      importantDates: string;
      documents: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateScheme(
        data.id,
        data.name,
        data.eligibilityDetails,
        data.applyLink,
        data.importantDates,
        data.documents
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
  });
}

export function useDeleteScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: SchemeId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteScheme(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
  });
}
