import { ProducteList } from '@/src/components/custom';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { producteService } from '@/src/services';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CatalegScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();

    const { data: productes = [], isLoading } = useQuery({
        queryKey: ['productes'],
        queryFn: producteService.getAll,
    });

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 24,
                paddingTop: insets.top + 16,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
            }}
        >
            <VStack space="md">
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => router.back()}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                        <ArrowLeft size={20} color={AppColors.Aqua} />
                        <Text className="text-festa-aqua font-schibsted">Tornar</Text>
                    </Pressable>
                </HStack>

                <Text className={`text-3xl font-fuzzy-bold ${isDark ? 'text-festa-aquaClar' : 'text-festa-aqua'}`}>
                    Catàleg
                </Text>
                <Text className="text-sm font-schibsted text-festa-baseMig">
                    Articles disponibles per al lloguer
                </Text>

                <ProducteList
                    productes={productes}
                    isLoading={isLoading}
                    isDark={isDark}
                    emptyText="Encara no hi ha articles disponibles"
                />
            </VStack>
        </ScrollView>
    );
}