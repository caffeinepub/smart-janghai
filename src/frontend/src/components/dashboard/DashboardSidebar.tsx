import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Newspaper,
  Radio,
  Building2,
  GraduationCap,
  Briefcase,
  User,
  Bookmark,
  HelpCircle,
  Users,
  FileText,
  Image,
  Bell,
  Settings,
  BarChart3,
  Shield,
  Vote,
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenuItem: string;
  onMenuItemClick: (item: string) => void;
  isAdminMode?: boolean;
}

const userMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'updates', label: 'Latest Updates', icon: Newspaper },
  { id: 'news', label: 'Local News', icon: Radio },
  { id: 'schemes', label: 'Government Schemes', icon: Building2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'saved', label: 'Saved Posts', icon: Bookmark },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

const adminMenuItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'news', label: 'Manage News', icon: Newspaper },
  { id: 'schemes', label: 'Government Schemes', icon: Building2 },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'voting-results', label: 'Voting Results', icon: Vote },
  { id: 'media', label: 'Media Library', icon: Image },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Website Settings', icon: Settings },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'security', label: 'Backup & Security', icon: Shield },
];

export default function DashboardSidebar({
  isOpen,
  onClose,
  activeMenuItem,
  onMenuItemClick,
  isAdminMode = false,
}: DashboardSidebarProps) {
  const menuItems = isAdminMode ? adminMenuItems : userMenuItems;

  const handleMenuClick = (itemId: string) => {
    onMenuItemClick(itemId);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <ScrollArea className="h-full py-4">
          <nav className="space-y-1 px-3" role="navigation" aria-label="Main navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`
                    w-full justify-start gap-3 h-11 px-3
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }
                  `}
                  onClick={() => handleMenuClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}
