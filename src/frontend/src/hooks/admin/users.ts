import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { User, UserStatus, UserRole } from '@/backend';
import { Principal } from '@dfinity/principal';

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUser(id: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User | null>({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getUser(Principal.fromText(id));
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; mobile: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createUser(data.name, data.mobile, data.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name: string; mobile: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateUser(Principal.fromText(data.id), data.name, data.mobile, data.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useSetUserStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status: UserStatus }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setUserStatus(Principal.fromText(data.id), data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignUserRole(Principal.fromText(data.id), data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
