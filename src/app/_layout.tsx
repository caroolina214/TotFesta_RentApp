import '@/global.css';
import { AuthProvider, QueryProvider, ThemeProvider, NotificationsProvider } from '@/src/providers';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useNotifications } from '@/src/hooks';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        'FuzzyBubbles': require('@/assets/fonts/FuzzyBubbles-Regular.ttf'),
        'FuzzyBubbles-Bold': require('@/assets/fonts/FuzzyBubbles-Bold.ttf'),
        'SchibstedGrotesk': require('@/assets/fonts/SchibstedGrotesk-VariableFont_wght.ttf'),
        'SchibstedGrotesk-Italic': require('@/assets/fonts/SchibstedGrotesk-Italic-VariableFont_wght.ttf'),
        'RobotoMono': require('@/assets/fonts/RobotoMono-VariableFont_wght.ttf'),
        'RobotoMono-Italic': require('@/assets/fonts/RobotoMono-Italic-VariableFont_wght.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <ThemeProvider>
            <QueryProvider>
                <AuthProvider>
                    <NotificationsProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                    </NotificationsProvider>
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}