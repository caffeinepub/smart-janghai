import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { News, NewsId } from '@/backend';

export function useGetAllNews() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<News[]>({
    queryKey: ['news'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllNews();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      tags: string[];
      featuredImage: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNews(
        data.title,
        data.description,
        data.category,
        data.tags,
        data.featuredImage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useUpdateNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: NewsId;
      title: string;
      description: string;
      category: string;
      tags: string[];
      featuredImage: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateNews(
        data.id,
        data.title,
        data.description,
        data.category,
        data.tags,
        data.featuredImage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function usePublishNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: NewsId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.publishNews(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useDeleteNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: NewsId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteNewsItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}
