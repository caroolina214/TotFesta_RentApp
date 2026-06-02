import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { Stack } from 'expo-router';
import '@/global.css';

export default function RootLayout() {
    return (
        <GluestackUIProvider mode="light">
            <Stack screenOptions={{ headerShown: false }} />
        </GluestackUIProvider>
    );
}