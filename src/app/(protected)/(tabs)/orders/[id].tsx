import { AppButton, ConfirmDialog } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { pedidoService } from '@/src/services/pedidoService';
import { EstadoPedido } from '@/src/types/Pedido';
import { getEstadoBg, getEstadoLabel } from '@/src/utils/pedidoUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [showConfirm, setShowConfirm] = useState(false);
    const [newEstado, setNewEstado] = useState<EstadoPedido | null>(null);

    const { data: pedido, isLoading } = useQuery({
        queryKey: ['pedidos', id],
        queryFn: () => pedidoService.getAll().then(p => p.find(p => p.id === Number(id))),
        enabled: !!id,
    });

    const updateEstadoMutation = useMutation({
        mutationFn: (estado: EstadoPedido) => pedidoService.updateEstado(Number(id), estado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            router.back();
        },
    });

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>
                <ActivityIndicator size="large" color={AppColors.Aqua} />
            </View>
        );
    }

    if (!pedido) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>
                <Text className="text-festa-baseMig font-schibsted">Pedido no trobat</Text>
            </View>
        );
    }

    const colors = getEstadoBg(pedido.estado);
    const label = getEstadoLabel(pedido.estado);

    const estats: EstadoPedido[] = ['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO'];

    return (
        <ScrollView contentContainerStyle={{
            paddingVertical: insets.top + 16,
            paddingHorizontal: 24,
            backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
            flexGrow: 1,
        }}>
            <VStack space="md">
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <ChevronLeft size={20} color={AppColors.Aqua} />
                        <Text className="text-festa-aqua font-schibsted">Pedidos</Text>
                    </Pressable>
                    <AppButton
                        label="Editar"
                        onPress={() => router.push(`/(protected)/(tabs)/orders/new?id=${id}`)}
                        icon={Pencil}
                        bgColor={AppColors.AquaClar}
                        textColor={AppColors.AquaObscur}
                        shadow
                    />
                </HStack>

                <HStack space="sm" style={{ alignItems: 'center' }}>
                    <Text className={`text-3xl font-fuzzy-bold ${isDark ? 'text-festa-moratClar' : 'text-festa-morat'}`}>
                        {pedido.codigo}
                    </Text>
                    <View style={{ backgroundColor: colors.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                        <Text style={{ fontSize: 11, fontFamily: 'SchibstedGrotesk', color: colors.text }}>{label}</Text>
                    </View>
                </HStack>

                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-aquaObscur' : 'bg-white'}`}>
                    <VStack space="sm">
                        <Text className="text-xs font-schibsted text-festa-baseMig uppercase tracking-widest">Dades del pedido</Text>
                        <Text className={`font-schibsted ${isDark ? 'text-festa-baseClar' : 'text-festa-baseObscur'}`}>
                            Client: {pedido.cliente.nombre}
                        </Text>
                        <Text className="font-schibsted text-festa-baseMig">
                            {pedido.fechaInicio} → {pedido.fechaFin}
                        </Text>
                        {pedido.notas && (
                            <Text className="font-schibsted text-festa-baseMig">{pedido.notas}</Text>
                        )}
                    </VStack>
                </Card>

                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                    <VStack space="sm">
                        <Text className="text-xs font-schibsted text-festa-baseMig uppercase tracking-widest">Canviar estat</Text>
                        <VStack space="xs">
                            {estats.map(estat => (
                                <AppButton
                                    key={estat}
                                    label={getEstadoLabel(estat)}
                                    onPress={() => { setNewEstado(estat); setShowConfirm(true); }}
                                    bgColor={pedido.estado === estat ? getEstadoBg(estat).bg : isDark ? AppColors.MoratObscur : AppColors.BaseClar}
                                    textColor={pedido.estado === estat ? getEstadoBg(estat).text : AppColors.BaseMig}
                                    outlined={pedido.estado !== estat}
                                    outlineColor={AppColors.BaseMig}
                                />
                            ))}
                        </VStack>
                    </VStack>
                </Card>
            </VStack>

            <ConfirmDialog
                visible={showConfirm}
                title="Canviar estat"
                message={`Vols canviar l'estat a ${newEstado ? getEstadoLabel(newEstado) : ''}?`}
                confirmText="Confirmar"
                onConfirm={() => newEstado && updateEstadoMutation.mutate(newEstado)}
                onClose={() => setShowConfirm(false)}
            />
        </ScrollView>
    );
}