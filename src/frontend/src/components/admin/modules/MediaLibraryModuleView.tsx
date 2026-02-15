import MediaUploadCard from '../media/MediaUploadCard';
import MediaList from '../media/MediaList';

export default function MediaLibraryModuleView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground mt-1">Upload and manage images and documents</p>
      </div>

      <MediaUploadCard />
      <MediaList />
    </div>
  );
}
