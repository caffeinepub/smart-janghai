import { useQuery, useMutation } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { AdminActivity } from '@/backend';

export function useGetAdminActivities() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminActivity[]>({
    queryKey: ['adminActivities'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const activities = await actor.getAllAdminActivities();
      return activities.sort((a, b) => Number(b.time - a.time));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useExportBackup() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const backup = await actor.exportBackup();
      
      const json = JSON.stringify(backup, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      , 2);
      
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
