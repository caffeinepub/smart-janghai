import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { WebsiteSettings } from '@/backend';

const SETTINGS_ID = 'main';

export function useGetWebsiteSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WebsiteSettings | null>({
    queryKey: ['websiteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWebsiteSettings(SETTINGS_ID);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateWebsiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: WebsiteSettings) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateWebsiteSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteSettings'] });
    },
  });
}
