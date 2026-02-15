import { useState, useEffect } from 'react';
import { useCreateScheme, useUpdateScheme } from '@/hooks/admin/schemes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DocumentsPickerDialog from './DocumentsPickerDialog';
import FormErrorText from '../common/FormErrorText';
import { Loader2, FileText, X } from 'lucide-react';
import type { Scheme, MediaId } from '@/backend';

interface SchemeFormProps {
  scheme: Scheme | null;
  onSuccess: () => void;
}

export default function SchemeForm({ scheme, onSuccess }: SchemeFormProps) {
  const [name, setName] = useState('');
  const [eligibilityDetails, setEligibilityDetails] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [importantDates, setImportantDates] = useState('');
  const [documents, setDocuments] = useState<MediaId[]>([]);
  const [showDocumentPicker, setShowDocumentPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateScheme();
  const updateMutation = useUpdateScheme();

  useEffect(() => {
    if (scheme) {
      setName(scheme.name);
      setEligibilityDetails(scheme.eligibilityDetails);
      setApplyLink(scheme.applyLink);
      setImportantDates(scheme.importantDates);
      setDocuments(scheme.documents);
    } else {
      setName('');
      setEligibilityDetails('');
      setApplyLink('');
      setImportantDates('');
      setDocuments([]);
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
          documents,
        });
      } else {
        await createMutation.mutateAsync({
          name,
          eligibilityDetails,
          applyLink,
          importantDates,
          documents,
        });
      }
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save scheme' });
    }
  };

  const handleRemoveDocument = (mediaId: MediaId) => {
    setDocuments((prev) => prev.filter((id) => id !== mediaId));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
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
          <Label htmlFor="eligibilityDetails">Eligibility Details *</Label>
          <Textarea
            id="eligibilityDetails"
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
          <Label htmlFor="importantDates">Important Dates</Label>
          <Textarea
            id="importantDates"
            value={importantDates}
            onChange={(e) => setImportantDates(e.target.value)}
            placeholder="Enter important dates"
            rows={3}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label>Documents</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDocumentPicker(true)}
            disabled={isPending}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            {documents.length > 0 ? 'Manage Documents' : 'Attach Documents'}
          </Button>
          {documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {documents.map((docId) => (
                <Badge key={docId} variant="secondary" className="pr-1">
                  {docId}
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(docId)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
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

      <DocumentsPickerDialog
        open={showDocumentPicker}
        onOpenChange={setShowDocumentPicker}
        onSelect={setDocuments}
        selectedMediaIds={documents}
      />
    </>
  );
}
