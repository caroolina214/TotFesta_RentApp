import { AppButton } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeStore } from '@/src/stores/themeStore';
import { router } from 'expo-router';
import { ChevronLeft, Moon, Sun, SunMoon } from 'lucide-react-native';
import { ScrollView, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreferencesScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const { theme, setTheme } = useThemeStore();

    const options = [
        { label: 'Clar', value: 'light' as const, icon: Sun },
        { label: 'Fosc', value: 'dark' as const, icon: Moon },
        { label: 'Sistema', value: 'system' as const, icon: SunMoon },
    ];

    return (
        <ScrollView contentContainerStyle={{
            paddingVertical: insets.top + 16,
            paddingHorizontal: 24,
            backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
        }}>
            <VStack space="md">
                {/* Capçalera */}
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <AppButton
                        label="Tornar"
                        onPress={() => router.replace('/(protected)/(tabs)')}
                        icon={ChevronLeft}
                        bgColor="transparent"
                        textColor={AppColors.Aqua}
                        iconColor={AppColors.Aqua}
                    />
                </HStack>

                <Text className="text-3xl font-fuzzy-bold text-festa-morat">
                    Preferències
                </Text>

                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                    <VStack space="md">
                        <Text className="text-xs font-schibsted text-festa-baseMig uppercase" style={{ letterSpacing: 1 }}>
                            Tema visual
                        </Text>
                        {options.map(option => (
                            <AppButton
                                key={option.value}
                                label={option.label}
                                onPress={() => setTheme(option.value)}
                                icon={option.icon}
                                bgColor={theme === option.value ? AppColors.AquaClar : isDark ? AppColors.MoratObscur : AppColors.BaseClar}
                                textColor={theme === option.value ? AppColors.AquaObscur : isDark ? AppColors.BaseClar : AppColors.BaseObscur}
                                iconColor={theme === option.value ? AppColors.AquaObscur : AppColors.BaseMig}
                                outlined={theme !== option.value}
                                outlineColor={isDark ? AppColors.MoratObscur : AppColors.BaseMig}
                                shadow={theme === option.value}
                            />
                        ))}
                    </VStack>
                </Card>
            </VStack>
        </ScrollView>
    );
}