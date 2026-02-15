import { useState } from 'react';
import UsersList from '../users/UsersList';
import UserFormDialog from '../users/UserFormDialog';
import UserDetailsDrawer from '../users/UserDetailsDrawer';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import type { User } from '@/backend';

export default function UsersModuleView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage user accounts</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <UsersList
        onEdit={setEditingUser}
        onView={setViewingUser}
      />

      <UserFormDialog
        open={isCreateOpen || !!editingUser}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingUser(null);
          }
        }}
        user={editingUser}
      />

      <UserDetailsDrawer
        user={viewingUser}
        open={!!viewingUser}
        onOpenChange={(open) => !open && setViewingUser(null)}
        onEdit={setEditingUser}
      />
    </div>
  );
}
