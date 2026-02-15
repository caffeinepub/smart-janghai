import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { Principal } from '@dfinity/principal';

export function useCreateNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { message: string; recipients: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      const principals = data.recipients.map((id) => Principal.fromText(id));
      await actor.createNotification(data.message, principals, BigInt(Date.now() * 1000000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useGetNotificationsHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Since there's no admin-specific notification history endpoint,
      // we'll return an empty array for now
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}
