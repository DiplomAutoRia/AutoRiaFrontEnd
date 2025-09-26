import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Notifications as NotificationsIcon } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Slide,
  Typography,
} from '@mui/material';

import type { RootState } from '../../redux/store';

export interface Notification {
  id: string;
  type: 'message' | 'vehicle' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

const NOTIFICATION_STORAGE_KEY = 'autoria_notifications';

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert timestamp strings back to Date objects
          const notificationsWithDates = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifications(notificationsWithDates);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    }
  }, [user]);

  // Save notifications to localStorage
  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updatedNotifications);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    getUnreadCount,
  };
};

export const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationSystem();
  const unreadCount = getUnreadCount();

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle notification click action based on type
    switch (notification.type) {
      case 'message':
        // Navigate to messages or open chat
        break;
      case 'vehicle':
        // Navigate to vehicle page
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffDays < 7) return `${diffDays} дн тому`;
    return timestamp.toLocaleDateString('uk-UA');
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton color="inherit" onClick={handleBellClick} sx={{ position: 'relative' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Slide direction="down" in={showNotifications} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: 350,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
            mt: 1,
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Сповіщення</Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead}>
                  Прочитати всі
                </Button>
              )}
            </Box>
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Немає сповіщень
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.slice(0, 10).map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  }}
                >
                  <ListItemIcon>
                    {notification.type === 'message' && '💬'}
                    {notification.type === 'vehicle' && '🚗'}
                    {notification.type === 'system' && 'ℹ️'}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Slide>
    </Box>
  );
};

// Hook to add notifications from other components
export const useAddNotification = () => {
  const { addNotification } = useNotificationSystem();

  const notifyNewMessage = (senderName: string, message: string, conversationId: number) => {
    addNotification({
      type: 'message',
      title: `Нове повідомлення від ${senderName}`,
      message: message,
      data: { conversationId },
    });
  };

  const notifyNewVehicle = (vehicleTitle: string, vehicleId: number) => {
    addNotification({
      type: 'vehicle',
      title: 'Нове оголошення',
      message: `Додано нове авто: ${vehicleTitle}`,
      data: { vehicleId },
    });
  };

  const notifySystem = (title: string, message: string) => {
    addNotification({
      type: 'system',
      title,
      message,
    });
  };

  return {
    notifyNewMessage,
    notifyNewVehicle,
    notifySystem,
  };
};
