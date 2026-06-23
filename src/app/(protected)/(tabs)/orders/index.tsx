import { AppButton } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { pedidoService } from '@/src/services/pedidoService';
import { useUserStore } from '@/src/stores/userStore';
import { getEstadoBg, getEstadoLabel } from '@/src/utils/pedidoUtils';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrdersScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { role } = useUserStore();

    const { data: pedidos = [], isLoading } = useQuery({
        queryKey: ['pedidos'],
        queryFn: pedidoService.getAll,
    });

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <View style={{ padding: 16, paddingBottom: 8 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text className="text-3xl font-fuzzy-bold text-festa-aqua">Pedidos</Text>
                    <AppButton
                        label="Nou pedido"
                        onPress={() => router.push('/(protected)/(tabs)/orders/new')}
                        icon={Plus}
                        bgColor={AppColors.Aqua}
                        textColor={AppColors.BaseObscur}
                        shadow
                    />
                </HStack>
            </View>

            {isLoading && (
                <ActivityIndicator size="large" color={AppColors.Aqua} style={{ marginTop: 24 }} />
            )}

            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
                <VStack space="md">
                    {pedidos.length === 0 ? (
                        <Card className="p-6 rounded-2xl">
                            <Text className="text-center text-festa-baseMig font-schibsted">
                                No hi ha pedidos
                            </Text>
                        </Card>
                    ) : (
                        pedidos.map(pedido => {
                            const colors = getEstadoBg(pedido.estado);
                            const label = getEstadoLabel(pedido.estado);
                            return (
                                <Pressable
                                    key={pedido.id}
                                    onPress={() => router.push({ pathname: '/orders/[id]', params: { id: pedido.id } })}
                                >
                                    <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                                        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <VStack space="xs" style={{ flex: 1 }}>
                                                <Text className={`font-schibsted text-base ${isDark ? 'text-festa-baseClar' : 'text-festa-baseObscur'}`}>
                                                    {pedido.codigo}
                                                </Text>
                                                <Text className="text-xs font-schibsted text-festa-baseMig">
                                                    {pedido.cliente.nombre}
                                                </Text>
                                                <Text className="text-xs font-schibsted text-festa-baseMig">
                                                    {pedido.fechaInicio} → {pedido.fechaFin}
                                                </Text>
                                            </VStack>
                                            <View style={{ backgroundColor: colors.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                                                <Text style={{ fontSize: 11, fontFamily: 'SchibstedGrotesk', color: colors.text }}>
                                                    {label}
                                                </Text>
                                            </View>
                                        </HStack>
                                    </Card>
                                </Pressable>
                            );
                        })
                    )}
                </VStack>
            </ScrollView>
        </View>
    );
}