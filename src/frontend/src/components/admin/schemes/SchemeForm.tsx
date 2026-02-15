import { useState, useEffect } from 'react';
import { useCreateScheme, useUpdateScheme } from '@/hooks/admin/schemes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormErrorText from '../common/FormErrorText';
import { Loader2 } from 'lucide-react';
import type { Scheme } from '@/backend';

interface SchemeFormProps {
  scheme: Scheme | null;
  onSuccess: () => void;
}

export default function SchemeForm({ scheme, onSuccess }: SchemeFormProps) {
  const [name, setName] = useState('');
  const [eligibilityDetails, setEligibilityDetails] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [importantDates, setImportantDates] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateScheme();
  const updateMutation = useUpdateScheme();

  useEffect(() => {
    if (scheme) {
      setName(scheme.name);
      setEligibilityDetails(scheme.eligibilityDetails);
      setApplyLink(scheme.applyLink);
      setImportantDates(scheme.importantDates);
    } else {
      setName('');
      setEligibilityDetails('');
      setApplyLink('');
      setImportantDates('');
    }
    setErrors({});
  }, [scheme]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!eligibilityDetails.trim()) newErrors.eligibilityDetails = 'Eligibility details are required';
    if (!applyLink.trim()) newErrors.applyLink = 'Apply link is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (scheme) {
        await updateMutation.mutateAsync({
          id: scheme.id,
          name,
          eligibilityDetails,
          applyLink,
          importantDates,
          documents: [],
        });
      } else {
        await createMutation.mutateAsync({
          name,
          eligibilityDetails,
          applyLink,
          importantDates,
          documents: [],
        });
      }
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save scheme' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Scheme Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter scheme name"
          disabled={isPending}
        />
        <FormErrorText error={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="eligibility">Eligibility Details *</Label>
        <Textarea
          id="eligibility"
          value={eligibilityDetails}
          onChange={(e) => setEligibilityDetails(e.target.value)}
          placeholder="Enter eligibility details"
          rows={4}
          disabled={isPending}
        />
        <FormErrorText error={errors.eligibilityDetails} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="applyLink">Apply Link *</Label>
        <Input
          id="applyLink"
          value={applyLink}
          onChange={(e) => setApplyLink(e.target.value)}
          placeholder="https://..."
          disabled={isPending}
        />
        <FormErrorText error={errors.applyLink} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dates">Important Dates</Label>
        <Textarea
          id="dates"
          value={importantDates}
          onChange={(e) => setImportantDates(e.target.value)}
          placeholder="Enter important dates"
          rows={3}
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
