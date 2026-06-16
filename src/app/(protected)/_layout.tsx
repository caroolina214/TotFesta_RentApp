import { authStore } from '@/src/store/authStore';
import { Redirect, Stack } from 'expo-router';
import { useState } from 'react';

export default function ProtectedLayout() {
    const [isAuthenticated] = useState(authStore.isAuthenticated());

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}