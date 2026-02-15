import { useState } from 'react';
import { useUploadMedia } from '@/hooks/admin/media';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import FormErrorText from '../common/FormErrorText';
import { Upload, Loader2 } from 'lucide-react';

export default function MediaUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadMutation = useUploadMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a valid image (JPEG, PNG, GIF, WebP) or PDF file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        file,
        onProgress: (percentage) => setUploadProgress(percentage),
      });
      setFile(null);
      setError('');
      setUploadProgress(0);
      // Reset input
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select File (Images or PDF)</Label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
          <FormErrorText error={error} />
        </div>

        {uploadMutation.isPending && uploadProgress > 0 && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-muted-foreground text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
