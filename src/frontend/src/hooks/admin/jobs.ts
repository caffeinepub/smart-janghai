import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Job, JobId } from '@/backend';

export function useGetAllJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      companyName: string;
      salary: bigint;
      qualification: string;
      applyLink: string;
      expiryDate: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJob(
        data.companyName,
        data.salary,
        data.qualification,
        data.applyLink,
        data.expiryDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: JobId;
      companyName: string;
      salary: bigint;
      qualification: string;
      applyLink: string;
      expiryDate: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateJob(
        data.id,
        data.companyName,
        data.salary,
        data.qualification,
        data.applyLink,
        data.expiryDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: JobId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteJob(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
