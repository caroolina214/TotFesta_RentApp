import { supabase } from '@/src/config/supabaseClient';
import { useUserStore } from '@/src/stores/userStore';
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setIsAuthenticated(true);
                loadUserProfile(session.user.id);
                router.replace('/(protected)/(tabs)');
            }
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setIsAuthenticated(true);
                loadUserProfile(session.user.id);
            } else {
                setIsAuthenticated(false);
                useUserStore.getState().clearUser();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadUserProfile = async (authUserId: string) => {
        const { data } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, email, id_rol')
            .eq('auth_user_id', authUserId)
            .maybeSingle();

        if (data) {
            useUserStore.getState().setUser({
                id: data.id_usuario,
                name: data.nombre,
                email: data.email,
                role: data.id_rol === 2 ? 'ADMIN' : 'NORMAL',
            });
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return false;
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

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