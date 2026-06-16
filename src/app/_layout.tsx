import '@/global.css';
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

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
        <GluestackUIProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </AuthProvider>
        </GluestackUIProvider>
    );
}