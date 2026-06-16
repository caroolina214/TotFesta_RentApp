import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usuarios } from '@/src/types/types';
import { useUserStore } from '@/src/stores/userStore';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem(SESSION_KEY).then(value => {
            if (value) {
                setIsAuthenticated(true);
                const { userId } = JSON.parse(value);
                const user = usuarios.find(u => u.id === userId);
                if (user) {
                    useUserStore.getState().setUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.roleId === 2 ? 'ADMIN' : 'NORMAL',
                    });
                }
                router.replace('/(protected)/(tabs)');
            }
            setIsLoading(false);
        });
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        const user = usuarios.find(u => u.email === email);

        if (!user) return false;

        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
        setIsAuthenticated(true);

        return true;
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        useUserStore.getState().clearUser();
        setIsAuthenticated(false);
        router.replace('/login');
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error('useAuth must be used within AuthProvider');

    return context;
}