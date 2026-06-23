import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { producteService } from '@/src/services';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CatalegScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    const { data: productes = [], isLoading } = useQuery({
        queryKey: ['productes'],
        queryFn: producteService.getAll,
    });

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            paddingTop: insets.top + 16,
            backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
        }}>
            <VStack space="md">
                {/* Capçalera */}
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <ArrowLeft size={20} color={AppColors.Aqua} />
                        <Text className="text-festa-aqua font-schibsted">Tornar</Text>
                    </Pressable>
                </HStack>

                <Text className={`text-3xl font-fuzzy-bold ${isDark ? 'text-festa-aquaClar' : 'text-festa-aqua'}`}>
                    Catàleg
                </Text>
                <Text className={`text-sm font-schibsted ${isDark ? 'text-festa-baseMig' : 'text-festa-baseMig'}`}>
                    Articles disponibles per al lloguer
                </Text>

                {isLoading && (
                    <ActivityIndicator size="large" color={AppColors.Aqua} style={{ marginTop: 24 }} />
                )}

                <VStack space="md">
                    {productes.map(producte => (
                        <Card
                            key={producte.id}
                            className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}
                        >
                            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <HStack space="md" style={{ alignItems: 'center', flex: 1 }}>
                                    <Package size={20} color={AppColors.Morat} />
                                    <VStack style={{ flex: 1 }}>
                                        <Text className={`font-schibsted text-base ${isDark ? 'text-festa-baseClar' : 'text-festa-baseObscur'}`}>
                                            {producte.nombre}
                                        </Text>
                                        {producte.descripcion && (
                                            <Text className="text-xs font-schibsted text-festa-baseMig">
                                                {producte.descripcion}
                                            </Text>
                                        )}
                                    </VStack>
                                </HStack>
                                <Text className="text-festa-aqua font-fuzzy-bold text-base">
                                    {producte.precioDia}€/dia
                                </Text>
                            </HStack>
                        </Card>
                    ))}
                </VStack>
            </VStack>
        </ScrollView>
    );
}