import { useState, useEffect } from 'react';
import { useCreateNews, useUpdateNews } from '@/hooks/admin/news';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormErrorText from '../common/FormErrorText';
import { Loader2 } from 'lucide-react';
import type { News } from '@/backend';

interface NewsFormProps {
  news: News | null;
  onSuccess: () => void;
}

export default function NewsForm({ news, onSuccess }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setDescription(news.description);
      setCategory(news.category);
      setTags(news.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setTags('');
    }
    setErrors({});
  }, [news]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (news) {
        await updateMutation.mutateAsync({
          id: news.id,
          title,
          description,
          category,
          tags: tagsArray,
          featuredImage: null,
        });
      } else {
        await createMutation.mutateAsync({
          title,
          description,
          category,
          tags: tagsArray,
          featuredImage: null,
        });
      }
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save news' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter news title"
          disabled={isPending}
        />
        <FormErrorText error={errors.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter news description"
          rows={6}
          disabled={isPending}
        />
        <FormErrorText error={errors.description} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
          disabled={isPending}
        />
        <FormErrorText error={errors.category} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
          disabled={isPending}
        />
      </div>

      {errors.submit && <FormErrorText error={errors.submit} />}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </form>
  );
}
