import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Media } from '@/backend';

interface MediaPreviewDialogProps {
  media: Media | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MediaPreviewDialog({ media, open, onOpenChange }: MediaPreviewDialogProps) {
  if (!media) return null;

  const isImage = media.contentType.startsWith('image/');
  const isPDF = media.contentType === 'application/pdf';
  const url = media.fileReference.getDirectURL();

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{media.filename}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isImage ? (
            <img src={url} alt={media.filename} className="w-full rounded-lg" />
          ) : isPDF ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">PDF Preview</p>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Open PDF
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Preview not available for this file type
            </div>
          )}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Size: {(Number(media.size) / 1024).toFixed(2)} KB</span>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
