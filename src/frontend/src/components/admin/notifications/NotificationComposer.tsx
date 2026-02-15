import { useState } from 'react';
import { useCreateNotification } from '@/hooks/admin/notifications';
import { useGetAllUsers } from '@/hooks/admin/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import FormErrorText from '../common/FormErrorText';
import { Send, Loader2 } from 'lucide-react';

export default function NotificationComposer() {
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all' | 'selected'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateNotification();
  const { data: users } = useGetAllUsers();

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!message.trim()) {
      setErrors({ message: 'Message is required' });
      return;
    }

    if (target === 'selected' && selectedUsers.length === 0) {
      setErrors({ users: 'Please select at least one user' });
      return;
    }

    try {
      const recipients = target === 'all' ? users?.map((u) => u.id.toString()) || [] : selectedUsers;
      await createMutation.mutateAsync({ message, recipients });
      setMessage('');
      setSelectedUsers([]);
      setTarget('all');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to send notification' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
              disabled={createMutation.isPending}
            />
            <FormErrorText error={errors.message} />
          </div>

          <div className="space-y-2">
            <Label>Target</Label>
            <RadioGroup value={target} onValueChange={(v) => setTarget(v as 'all' | 'selected')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All Users
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="font-normal cursor-pointer">
                  Selected Users
                </Label>
              </div>
            </RadioGroup>
          </div>

          {target === 'selected' && (
            <div className="space-y-2">
              <Label>Select Users</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {users?.map((user) => (
                  <div key={user.id.toString()} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id.toString()}
                      checked={selectedUsers.includes(user.id.toString())}
                      onCheckedChange={() => handleUserToggle(user.id.toString())}
                    />
                    <Label htmlFor={user.id.toString()} className="font-normal cursor-pointer">
                      {user.name} ({user.email})
                    </Label>
                  </div>
                ))}
              </div>
              <FormErrorText error={errors.users} />
            </div>
          )}

          {errors.submit && <FormErrorText error={errors.submit} />}

          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
