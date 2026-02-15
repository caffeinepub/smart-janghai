import { useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import DashboardMainContent from './DashboardMainContent';
import DashboardRightPanel from './DashboardRightPanel';
import AdminModuleRouter from '@/components/admin/AdminModuleRouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
  isAdminMode?: boolean;
}

export default function DashboardLayout({ onNavigate, isAdminMode = false }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(isAdminMode ? 'overview' : 'dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <DashboardNavbar onNavigate={onNavigate} isAdminMode={isAdminMode} />

      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-50 lg:hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Sidebar */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeMenuItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
          isAdminMode={isAdminMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {isAdminMode ? (
              <AdminModuleRouter activeModule={activeMenuItem} />
            ) : (
              <div className="flex gap-6">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <DashboardMainContent />
                </div>

                {/* Right Panel (hidden on mobile/tablet) */}
                <div className="hidden xl:block w-80 flex-shrink-0">
                  <DashboardRightPanel />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
