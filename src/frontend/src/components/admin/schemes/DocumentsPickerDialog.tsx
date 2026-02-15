import { useState } from 'react';
import { useGetAllMedia } from '@/hooks/admin/media';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download } from 'lucide-react';
import type { MediaId } from '@/backend';

interface DocumentsPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mediaIds: MediaId[]) => void;
  selectedMediaIds: MediaId[];
}

export default function DocumentsPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedMediaIds,
}: DocumentsPickerDialogProps) {
  const { data: media, isLoading } = useGetAllMedia();
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<MediaId[]>(selectedMediaIds);

  // Filter for PDFs and documents only
  const documentMedia = media?.filter((item) => 
    item.contentType === 'application/pdf' || 
    item.contentType.includes('document')
  ) || [];
  
  const filteredMedia = documentMedia.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (mediaId: MediaId) => {
    setTempSelected((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const handleSave = () => {
    onSelect(tempSelected);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedMediaIds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Documents</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No documents found. Upload PDFs in the Media Library first.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={tempSelected.includes(item.id)}
                      onCheckedChange={() => handleToggle(item.id)}
                    />
                    <FileText className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {(Number(item.size) / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Badge variant="outline">PDF</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(item.fileReference.getDirectURL(), '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {tempSelected.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {tempSelected.length} document{tempSelected.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
