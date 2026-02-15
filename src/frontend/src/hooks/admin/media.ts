import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { ExternalBlob } from '@/backend';
import type { Media, MediaId } from '@/backend';

export function useGetAllMedia() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Media[]>({
    queryKey: ['media'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMedia();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      filename: string; 
      contentType: string; 
      file: File;
      onProgress?: (percentage: number) => void;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      const arrayBuffer = await data.file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      let blob = ExternalBlob.fromBytes(bytes);
      
      // Add upload progress tracking if callback provided
      if (data.onProgress) {
        blob = blob.withUploadProgress(data.onProgress);
      }
      
      return actor.uploadMedia(data.filename, data.contentType, blob, BigInt(data.file.size));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: MediaId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteMedia(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
