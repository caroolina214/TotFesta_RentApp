import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { AppColors } from '@/src/constants/colors';
import { Home, Users } from 'lucide-react-native';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: AppColors.Aqua,
                tabBarInactiveTintColor: AppColors.BaseMig,
                tabBarStyle: {
                    backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
                    borderTopColor: isDark ? AppColors.MoratObscur : AppColors.AquaClar,
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
                }}
            />
        </Tabs>
    );
}