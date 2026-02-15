import { useState, useEffect } from 'react';
import { useCreateJob, useUpdateJob } from '@/hooks/admin/jobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormErrorText from '../common/FormErrorText';
import { Loader2 } from 'lucide-react';
import type { Job } from '@/backend';

interface JobFormProps {
  job: Job | null;
  onSuccess: () => void;
}

export default function JobForm({ job, onSuccess }: JobFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [qualification, setQualification] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();

  useEffect(() => {
    if (job) {
      setCompanyName(job.companyName);
      setSalary(job.salary.toString());
      setQualification(job.qualification);
      setApplyLink(job.applyLink);
      // Convert nanoseconds to date string
      const date = new Date(Number(job.expiryDate) / 1000000);
      setExpiryDate(date.toISOString().split('T')[0]);
    } else {
      setCompanyName('');
      setSalary('');
      setQualification('');
      setApplyLink('');
      setExpiryDate('');
    }
    setErrors({});
  }, [job]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!salary.trim()) newErrors.salary = 'Salary is required';
    else if (isNaN(Number(salary)) || Number(salary) < 0) newErrors.salary = 'Invalid salary amount';
    if (!qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!applyLink.trim()) newErrors.applyLink = 'Apply link is required';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert date to nanoseconds timestamp
    const expiryTimestamp = BigInt(new Date(expiryDate).getTime() * 1000000);

    try {
      if (job) {
        await updateMutation.mutateAsync({
          id: job.id,
          companyName,
          salary: BigInt(salary),
          qualification,
          applyLink,
          expiryDate: expiryTimestamp,
        });
      } else {
        await createMutation.mutateAsync({
          companyName,
          salary: BigInt(salary),
          qualification,
          applyLink,
          expiryDate: expiryTimestamp,
        });
      }
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save job' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          disabled={isPending}
        />
        <FormErrorText error={errors.companyName} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Salary (₹) *</Label>
        <Input
          id="salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Enter salary amount"
          disabled={isPending}
        />
        <FormErrorText error={errors.salary} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualification">Qualification *</Label>
        <Textarea
          id="qualification"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          placeholder="Enter required qualification"
          rows={3}
          disabled={isPending}
        />
        <FormErrorText error={errors.qualification} />
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
        <Label htmlFor="expiryDate">Expiry Date *</Label>
        <Input
          id="expiryDate"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          disabled={isPending}
        />
        <FormErrorText error={errors.expiryDate} />
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
