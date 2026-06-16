import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => Promise<void>;
    loadTheme: () => Promise<void>;
}

const THEME_KEY = 'app_theme';

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'system',
    setTheme: async (theme) => {
        await AsyncStorage.setItem(THEME_KEY, theme);
        set({ theme });
    },
    loadTheme: async () => {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved) set({ theme: saved as ThemeMode });
    },
}));