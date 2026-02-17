import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { Principal } from '@dfinity/principal';
import type { Notification } from '@/backend';

export function useCreateNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { message: string; recipients: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      const principals = data.recipients.map((id) => Principal.fromText(id));
      await actor.createNotification(data.message, principals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsHistory'] });
    },
  });
}

export function useGetNotificationsHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notificationsHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllNotifications();
    },
    enabled: !!actor && !actorFetching,
  });
}
