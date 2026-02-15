import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerRole } from '@/hooks/admin/useAdminAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toRoleLabel } from '@/utils/userRole';
import TextLogo from '@/components/site/TextLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';

interface DashboardNavbarProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
  isAdminMode?: boolean;
}

export default function DashboardNavbar({ onNavigate, isAdminMode = false }: DashboardNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { identity, clear } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // Clear identity and all cached data
    await clear();
    queryClient.clear();
    
    // Navigate to appropriate login page based on mode
    // This will update both the URL hash and render the correct page
    const targetPage = isAdminMode ? 'admin-login' : 'login';
    onNavigate(targetPage);
  };

  const principalText = identity?.getPrincipal().toString() || '';
  const shortPrincipal = principalText.length > 12 
    ? `${principalText.slice(0, 6)}...${principalText.slice(-4)}`
    : principalText;

  const roleLabel = toRoleLabel(role);

  return (
    <nav className="sticky top-0 z-40 bg-primary border-b border-primary/20 shadow-soft">
      <div className="px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <TextLogo size="sm" variant="light" />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Bell className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {roleLabel.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-medium">{shortPrincipal}</span>
                  <span className="text-xs opacity-80">{roleLabel}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
