import { useState } from 'react';

/**
 * Hook for browser notifications.
 * If notifications are not permitted or unsupported, returns noop send.
 */
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof Notification !== 'undefined') {
      return Notification.permission;
    }
    return 'denied';
  });

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return 'denied';
    if (permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return permission;
  };

  const send = (title: string, options?: NotificationOptions) => {
    if (typeof Notification === 'undefined') return;
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };

  return { permission, requestPermission, send };
}
