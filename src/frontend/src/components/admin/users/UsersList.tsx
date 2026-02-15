import { useState } from 'react';
import { useGetAllUsers, useSetUserStatus } from '@/hooks/admin/users';
import AdminDataTable from '../common/AdminDataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Power, PowerOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserStatus } from '@/backend';
import type { User } from '@/backend';

interface UsersListProps {
  onEdit: (user: User) => void;
  onView: (user: User) => void;
}

export default function UsersList({ onEdit, onView }: UsersListProps) {
  const { data: users, isLoading } = useGetAllUsers();
  const setStatusMutation = useSetUserStatus();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.mobile.includes(searchQuery)
  ) || [];

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === UserStatus.active ? UserStatus.inactive : UserStatus.active;
    await setStatusMutation.mutateAsync({ id: user.id.toString(), status: newStatus });
  };

  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => <span className="font-medium">{user.name}</span>,
    },
    {
      header: 'Email',
      accessor: (user: User) => <span className="text-sm text-muted-foreground">{user.email}</span>,
    },
    {
      header: 'Mobile',
      accessor: (user: User) => <span className="text-sm">{user.mobile}</span>,
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <Badge variant="outline" className="capitalize">
          {user.role}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: (user: User) => (
        <Badge variant={user.status === UserStatus.active ? 'default' : 'secondary'} className="capitalize">
          {user.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(user)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(user)}
            disabled={setStatusMutation.isPending}
          >
            {user.status === UserStatus.active ? (
              <PowerOff className="w-4 h-4 text-destructive" />
            ) : (
              <Power className="w-4 h-4 text-green-600" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <AdminDataTable
          data={filteredUsers}
          columns={columns}
          searchPlaceholder="Search users by name, email, or mobile..."
          onSearch={setSearchQuery}
          emptyMessage="No users found"
        />
      </CardContent>
    </Card>
  );
}
