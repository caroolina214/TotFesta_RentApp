import { useAuth } from '@/src/providers/AuthProvider';
import { useNotifications } from '@/src/hooks';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';

type NotificationsState = ReturnType<typeof useNotifications>;

const NotificationsContext = createContext<NotificationsState | null>(null);

export function NotificationsProvider({ children }: PropsWithChildren) {
    const { isAuthenticated } = useAuth();
    const notifications = useNotifications({ requestPermissionsOnMount: false });

    useEffect(() => {
        if (isAuthenticated) {
            notifications.registerForPushNotificationsAsync();
        }
    }, [isAuthenticated]);

    return (
        <NotificationsContext.Provider value={notifications}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotificationsContext() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotificationsContext debe usarse dentro de NotificationsProvider');
    }
    return context;
}