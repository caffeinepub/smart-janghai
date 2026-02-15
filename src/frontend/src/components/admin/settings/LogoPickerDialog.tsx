import { useState } from 'react';
import { useGetAllMedia } from '@/hooks/admin/media';
import { useUpdateWebsiteSettings, useGetWebsiteSettings } from '@/hooks/admin/settings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LogoPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLogoId: string | null;
}

export default function LogoPickerDialog({ open, onOpenChange, currentLogoId }: LogoPickerDialogProps) {
  const { data: media, isLoading } = useGetAllMedia();
  const { data: settings } = useGetWebsiteSettings();
  const updateMutation = useUpdateWebsiteSettings();
  const [selectedId, setSelectedId] = useState<string | null>(currentLogoId);

  const imageMedia = media?.filter((m) => m.contentType.startsWith('image/')) || [];

  const handleSave = async () => {
    if (!settings) return;

    try {
      await updateMutation.mutateAsync({
        ...settings,
        logo: selectedId ?? undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update logo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Logo</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading media...</div>
          ) : imageMedia.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No images available. Please upload an image first.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {imageMedia.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    selectedId === item.id ? 'border-primary ring-2 ring-primary' : 'border-border'
                  }`}
                >
                  <img
                    src={item.fileReference.getDirectURL()}
                    alt={item.filename}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-2 text-xs truncate">{item.filename}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending || !selectedId}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
