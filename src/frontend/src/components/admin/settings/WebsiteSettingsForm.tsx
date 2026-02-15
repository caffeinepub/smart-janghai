import { useState, useEffect } from 'react';
import { useUpdateWebsiteSettings } from '@/hooks/admin/settings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormErrorText from '../common/FormErrorText';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import type { WebsiteSettings } from '@/backend';

interface WebsiteSettingsFormProps {
  settings: WebsiteSettings | null;
  onOpenLogoPicker: () => void;
}

export default function WebsiteSettingsForm({ settings, onOpenLogoPicker }: WebsiteSettingsFormProps) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateWebsiteSettings();

  useEffect(() => {
    if (settings) {
      setName(settings.name);
      setTagline(settings.tagline);
      setContactInfo(settings.contactInfo);
      setSeoTitle(settings.seoTitle);
      setSeoDescription(settings.seoDescription);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors({ name: 'Website name is required' });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: 'main',
        name,
        tagline,
        contactInfo,
        seoTitle,
        seoDescription,
        logo: settings?.logo ?? undefined,
        socialLinks: settings?.socialLinks || [],
      });
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save settings' });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <Button type="button" variant="outline" onClick={onOpenLogoPicker}>
              <ImageIcon className="w-4 h-4 mr-2" />
              {settings?.logo ? 'Change Logo' : 'Select Logo'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Website Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter website name"
              disabled={updateMutation.isPending}
            />
            <FormErrorText error={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Enter tagline"
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information</Label>
            <Textarea
              id="contact"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Enter contact information"
              rows={3}
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Enter SEO title"
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Enter SEO description"
              rows={3}
              disabled={updateMutation.isPending}
            />
          </div>

          {errors.submit && <FormErrorText error={errors.submit} />}

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
