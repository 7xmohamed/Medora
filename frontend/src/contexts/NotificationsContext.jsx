import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        if (!user) return;

        try {
            const endpoint = user.role === 'admin'
                ? '/admin/notifications'
                : '/doctor/notifications';

            const response = await api.get(endpoint);

            if (response.data.success) {
                setNotifications(response.data.notifications || []);
                setUnreadCount(response.data.notifications?.filter(n => !n.read_at).length || 0);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (notificationId) => {
        if (!user) return;

        try {
            const endpoint = user.role === 'admin'
                ? `/admin/notifications/${notificationId}/read`
                : `/doctor/notifications/${notificationId}/read`;

            await api.post(endpoint);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;

        try {
            const endpoint = user.role === 'admin'
                ? '/admin/notifications/mark-all-read'
                : '/doctor/notifications/mark-all-read';

            await api.post(endpoint);
            setNotifications(prev =>
                prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Set up polling for new notifications every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            // Add event listener for new notifications via WebSocket
            const channel = window.Echo.private(`notifications.${user.id}`)
                .listen('NewNotification', (notification) => {
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                });

            return () => {
                channel.stopListening('NewNotification');
            };
        }
    }, [user]);

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            refreshNotifications: fetchNotifications
        }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationsContext);
