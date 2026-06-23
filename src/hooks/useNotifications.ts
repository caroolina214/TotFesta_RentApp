import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@/src/config/supabaseClient';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

type UseNotificationsOptions = {
    androidChannelId?: string;
    androidChannel?: Notifications.NotificationChannelInput;
    onNotification?: (notification: Notifications.Notification) => void;
    onResponse?: (response: Notifications.NotificationResponse) => void;
    requestPermissionsOnMount?: boolean;
};

export function useNotifications(options: UseNotificationsOptions = {}) {
    const {
        androidChannelId = 'default',
        androidChannel,
        onNotification,
        onResponse,
        requestPermissionsOnMount = true,
    } = options;

    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [notificationResponse, setNotificationResponse] = useState<Notifications.NotificationResponse | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    const registerForPushNotificationsAsync = useCallback(async () => {
        setError(null);

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync(
                androidChannelId,
                androidChannel ?? {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#00BCD4',
                }
            );
        }

        if (!Device.isDevice) {
            setError('Necessites un dispositiu físic per a rebre notificacions push');
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        setPermissionStatus(finalStatus);

        if (finalStatus !== 'granted') {
            setError('Permís de notificacions denegat');
            return null;
        }

        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            setError('No s\'ha trobat el projectId d\'EAS');
            return null;
        }

        try {
            const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
            setExpoPushToken(tokenResponse.data);

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('usuarios')
                    .update({ push_token: tokenResponse.data })
                    .eq('auth_user_id', user.id);
            }

            return tokenResponse.data;
        } catch (err) {
            setError(`Error obtenint el token: ${String(err)}`);
            return null;
        }
    }, [androidChannel, androidChannelId]);

    useEffect(() => {
        if (requestPermissionsOnMount) {
            void registerForPushNotificationsAsync();
        }
    }, [registerForPushNotificationsAsync, requestPermissionsOnMount]);

    useEffect(() => {
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            onNotification?.(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            setNotificationResponse(response);
            onResponse?.(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [onNotification, onResponse]);

    return {
        expoPushToken,
        notification,
        notificationResponse,
        permissionStatus,
        error,
        registerForPushNotificationsAsync,
    };
}