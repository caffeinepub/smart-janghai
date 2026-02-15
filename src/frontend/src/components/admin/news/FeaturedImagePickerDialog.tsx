import { useState } from 'react';
import { useGetAllMedia } from '@/hooks/admin/media';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Check } from 'lucide-react';
import type { MediaId } from '@/backend';

interface FeaturedImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mediaId: MediaId | null) => void;
  selectedMediaId: MediaId | null;
}

export default function FeaturedImagePickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedMediaId,
}: FeaturedImagePickerDialogProps) {
  const { data: media, isLoading } = useGetAllMedia();
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<MediaId | null>(selectedMediaId);

  // Filter for images only
  const imageMedia = media?.filter((item) => item.contentType.startsWith('image/')) || [];
  
  const filteredMedia = imageMedia.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    onSelect(tempSelected);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedMediaId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Featured Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square" />
                ))}
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No images found. Upload images in the Media Library first.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredMedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTempSelected(item.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      tempSelected === item.id
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={item.fileReference.getDirectURL()}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                    {tempSelected === item.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {tempSelected ? 'Select Image' : 'Clear Selection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
