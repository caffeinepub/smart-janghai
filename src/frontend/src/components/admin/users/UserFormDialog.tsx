import { useState, useEffect } from 'react';
import { useCreateUser, useUpdateUser } from '@/hooks/admin/users';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormErrorText from '../common/FormErrorText';
import { Loader2 } from 'lucide-react';
import type { User } from '@/backend';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export default function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setMobile(user.mobile);
      setEmail(user.email);
    } else {
      setName('');
      setMobile('');
      setEmail('');
    }
    setErrors({});
  }, [user, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (user) {
        await updateMutation.mutateAsync({
          id: user.id.toString(),
          name,
          mobile,
          email,
        });
      } else {
        await createMutation.mutateAsync({ name, mobile, email });
      }
      onOpenChange(false);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save user' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              disabled={isPending}
            />
            <FormErrorText error={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile *</Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              disabled={isPending}
            />
            <FormErrorText error={errors.mobile} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={isPending}
            />
            <FormErrorText error={errors.email} />
          </div>

          {errors.submit && <FormErrorText error={errors.submit} />}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
