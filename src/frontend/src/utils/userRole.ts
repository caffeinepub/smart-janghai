import { UserRole } from '@/backend';

/**
 * Safely checks if a UserRole value represents an admin role.
 * Handles enum values correctly.
 */
export function isAdminRole(role: UserRole | undefined | null): boolean {
  if (!role) return false;
  
  // Handle enum value
  return role === UserRole.admin;
}

/**
 * Converts a UserRole to a human-readable label.
 */
export function toRoleLabel(role: UserRole | undefined | null): string {
  if (!role) return 'Guest';
  
  if (role === UserRole.admin) return 'Admin';
  if (role === UserRole.user) return 'User';
  if (role === UserRole.guest) return 'Guest';
  
  return 'Guest';
}
