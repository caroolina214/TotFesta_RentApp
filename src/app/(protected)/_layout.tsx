import { Redirect, Stack } from 'expo-router';
import { authStore } from '@/src/store/authStore';
import { useState } from 'react';

export default function ProtectedLayout() {
    const [isAuthenticated] = useState(authStore.isAuthenticated());

    if (!isAuthenticated) {
        return <Redirect href="/LoginPage" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}