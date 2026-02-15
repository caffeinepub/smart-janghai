import { useState } from 'react';
import { useGetAllMedia, useDeleteMedia } from '@/hooks/admin/media';
import MediaPreviewDialog from './MediaPreviewDialog';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Eye, Trash2, Download } from 'lucide-react';
import type { Media } from '@/backend';

export default function MediaList() {
  const { data: media, isLoading } = useGetAllMedia();
  const deleteMutation = useDeleteMedia();
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);

  const filteredMedia = media?.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contentType.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search media by filename or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No media files found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const isImage = item.contentType.startsWith('image/');
                const isPDF = item.contentType === 'application/pdf';

                return (
                  <div key={item.id} className="border rounded-lg overflow-hidden group">
                    <div className="aspect-square bg-muted flex items-center justify-center relative">
                      {isImage ? (
                        <img
                          src={item.fileReference.getDirectURL()}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Badge variant="outline">{isPDF ? 'PDF' : 'FILE'}</Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPreviewMedia(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{item.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {(Number(item.size) / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <MediaPreviewDialog
        media={previewMedia}
        open={!!previewMedia}
        onOpenChange={(open) => !open && setPreviewMedia(null)}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        description="Are you sure you want to delete this media file? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
