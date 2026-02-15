import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationLauncherButtonProps {
  onClick: () => void;
  unreadCount: number;
}

export default function NotificationLauncherButton({
  onClick,
  unreadCount,
}: NotificationLauncherButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="relative bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
}
