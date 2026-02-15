import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { useAssignUserRole } from '@/hooks/admin/users';
import { UserRole, UserStatus } from '@/backend';
import type { User } from '@/backend';

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
}

export default function UserDetailsDrawer({ user, open, onOpenChange, onEdit }: UserDetailsDrawerProps) {
  const assignRoleMutation = useAssignUserRole();

  if (!user) return null;

  const registrationDate = new Date(Number(user.registrationDate) / 1000000).toLocaleDateString();

  const handleRoleChange = async (newRole: UserRole) => {
    await assignRoleMutation.mutateAsync({
      id: user.id.toString(),
      role: newRole,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="mt-1 text-lg font-semibold">{user.name}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="mt-1">{user.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Mobile</h3>
            <p className="mt-1">{user.mobile}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="role-select">Role</Label>
            <Select 
              value={user.role} 
              onValueChange={(value) => handleRoleChange(value as UserRole)}
              disabled={assignRoleMutation.isPending}
            >
              <SelectTrigger id="role-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.admin}>Admin</SelectItem>
                <SelectItem value={UserRole.user}>User</SelectItem>
                <SelectItem value={UserRole.guest}>Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge variant={user.status === UserStatus.active ? 'default' : 'secondary'} className="mt-1 capitalize">
              {user.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
            <p className="mt-1">{registrationDate}</p>
          </div>

          <Button onClick={() => onEdit(user)} className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
