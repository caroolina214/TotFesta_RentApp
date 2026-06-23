import { ProducteList } from '@/src/components/custom';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { producteService } from '@/src/services';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CatalegScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();

    const { data: productes = [], isLoading } = useQuery({
        queryKey: ['productes'],
        queryFn: producteService.getAll,
    });

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>
            <ScrollView contentContainerStyle={{ padding: 24, paddingTop: insets.top + 16 }}>
                <VStack space="md">
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
        </View>
    );
}