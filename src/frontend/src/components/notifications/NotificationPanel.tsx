import { useEffect } from 'react';
import { X, Trash2, CheckCheck, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useExampleNotifications, type Notification } from '@/hooks/useExampleNotifications';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    dismissNotification,
    clearAll,
    markAllAsRead,
    getRelativeTimeLabel,
  } = useExampleNotifications();

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-background border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-panel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 id="notification-panel-title" className="text-lg font-semibold">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          </div>
        )}

        {/* Notification List */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                  getRelativeTimeLabel={getRelativeTimeLabel}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  getRelativeTimeLabel: (date: Date) => string;
}

function NotificationItem({
  notification,
  onDismiss,
  getRelativeTimeLabel,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 hover:bg-muted/50 transition-colors ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{notification.title}</h3>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {getRelativeTimeLabel(notification.timestamp)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDismiss(notification.id)}
          className="flex-shrink-0 h-8 w-8"
          aria-label={`Dismiss ${notification.title}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
