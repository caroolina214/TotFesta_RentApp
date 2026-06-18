import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    setTheme: (theme: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('light');

    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY).then(saved => {
            if (saved) setThemeState(saved as ThemeMode);
        });
    }, []);

    const setTheme = async (newTheme: ThemeMode) => {
        await AsyncStorage.setItem(THEME_KEY, newTheme);
        setThemeState(newTheme);
    };

    const resolvedMode = theme;

    return (
        <ThemeContext.Provider value={{ theme, isDark: resolvedMode === 'dark', setTheme }}>
            <GluestackUIProvider mode={resolvedMode}>
                {children}
            </GluestackUIProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
    return ctx;
}