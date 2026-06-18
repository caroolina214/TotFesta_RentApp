import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers/ThemeProvider';
import { useUserStore } from '@/src/stores/userStore';
import { Tabs } from 'expo-router';
import { Home, Users } from 'lucide-react-native';

export default function TabsLayout() {
    const { isDark } = useThemeContext();
    const { role } = useUserStore();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: AppColors.Aqua,
                tabBarInactiveTintColor: AppColors.BaseMig,
                tabBarStyle: {
                    backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
                    borderTopColor: AppColors.BaseMig,
                },
                tabBarLabelStyle: {
                    fontFamily: 'SchibstedGrotesk',
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inici',
                    tabBarIcon: ({ color }) => <Home size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="clients"
                options={{
                    title: 'Clients',
                    tabBarIcon: ({ color }) => <Users size={22} color={color} />,
                    href: role === 'ADMIN' ? undefined : null,
                }}
            />
        </Tabs>
    );
}