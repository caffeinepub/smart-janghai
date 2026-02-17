import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface SystemStatus {
  isDecommissioned: boolean;
}

export function useSystemStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<SystemStatus>({
    queryKey: ['systemStatus'],
    queryFn: async () => {
      if (!actor) {
        // Non-blocking: treat missing actor as "not decommissioned" to allow UI to render
        return { isDecommissioned: false };
      }

      try {
        // Try to call a minimal read-only method to detect decommission state
        // If the backend is decommissioned, any call will trap with the decommission message
        await actor.getAllPublishedNews();
        return { isDecommissioned: false };
      } catch (error: any) {
        // Check if the error message indicates decommissioning
        const errorMessage = error?.message || String(error);
        if (
          errorMessage.includes('decommissioned') ||
          errorMessage.includes('Service Unavailable')
        ) {
          return { isDecommissioned: true };
        }
        // For other errors, assume not decommissioned (fail open)
        return { isDecommissioned: false };
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0, // Always check fresh
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return query;
}
