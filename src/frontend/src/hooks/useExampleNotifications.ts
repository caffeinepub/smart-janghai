import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Welcome!',
    message: 'Thank you for visiting. Explore our features and resources.',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    title: 'New Updates Available',
    message: 'Check out the latest improvements and enhancements to our platform.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
  },
  {
    id: '3',
    title: 'Community Highlight',
    message: 'Join our growing community and connect with like-minded individuals.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
  {
    id: '4',
    title: 'Feature Announcement',
    message: 'Exciting new features are coming soon. Stay tuned for more updates!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    read: true,
  },
];

function getRelativeTimeLabel(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export function useExampleNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    dismissNotification,
    clearAll,
    markAllAsRead,
    getRelativeTimeLabel,
  };
}
