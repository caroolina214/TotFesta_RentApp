import { AppButton } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers/ThemeProvider';
import { router } from 'expo-router';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreferencesScreen() {
    const { isDark } = useThemeContext();
    const { theme, setTheme } = useThemeContext();
    const insets = useSafeAreaInsets();
    const isWeb = Platform.OS === 'web';

    const options = [
        { label: 'Clar', value: 'light' as const, icon: Sun },
        { label: 'Fosc', value: 'dark' as const, icon: Moon },
        // { label: 'Sistema', value: 'system' as const, icon: SunMoon },
    ];

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: insets.top + 16,
            paddingHorizontal: 20,
            backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
        }}>
            <AppButton
                label="Tornar"
                onPress={() => router.replace('/(protected)/(tabs)')}
                icon={ChevronLeft}
                bgColor="transparent"
                textColor={AppColors.Aqua}
                iconColor={AppColors.Aqua}
            />
            <VStack space="md">
                <Text className={'text-3xl my-2 font-fuzzy-bold text-festa-morat'}>
                    Preferències
                </Text>

                <Card className={`p-4 rounded-2xl shadow-md elevation-sm ${isDark
                    ? `bg-festa-aquaObscur ${isWeb ? 'shadow-black' : 'shadow-festa-baseClar'}`
                    : 'bg-white'
                    }`}>
                    <VStack space="md">
                        <Text className={`text-xs font-schibsted uppercase tracking-widest ${isDark ? 'text-festa-aquaClar' : 'text-festa-baseObscur'}`}>
                            Tema visual
                        </Text>
                        {options.map(option => (
                            <AppButton
                                key={option.value}
                                label={option.label}
                                onPress={() => setTheme(option.value)}
                                icon={option.icon}
                                bgColor={theme === option.value ? (isDark ? AppColors.BaseClar : AppColors.AquaClar) : isDark ? AppColors.BaseMig : AppColors.BaseClar}
                                textColor={theme === option.value ? (isDark ? AppColors.BaseObscur : AppColors.AquaObscur) : isDark ? AppColors.BaseClar : AppColors.BaseMig}
                                iconColor={theme === option.value ? (isDark ? AppColors.BaseObscur : AppColors.AquaObscur) : isDark ? AppColors.BaseClar : AppColors.BaseMig}
                                outlined={theme === option.value}
                                outlineColor={isDark ? AppColors.GrocObscur : AppColors.AquaObscur}
                                shadow={theme === option.value}
                            />
                        ))}
                    </VStack>
                </Card>
            </VStack>
        </ScrollView >
    );
}