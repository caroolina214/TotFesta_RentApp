import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View, useColorScheme, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Card } from '@/src/components/ui/card';
import { VStack } from '@/src/components/ui/vstack';
import { HStack } from '@/src/components/ui/hstack';
import { Cliente, DireccionCliente, PedidoConDetalle } from '@/src/types/types';
import { clientes, direccionesCliente, listPedidosResumen } from '@/src/types/types';
import { AppColors } from '@/src/constants/colors';
import { Phone, Mail, FileText, MapPin, Pencil, UserX, Package, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClientDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    const [client, setClient] = useState<Cliente | null>(null);
    const [direccion, setDireccion] = useState<DireccionCliente | null>(null);
    const [pedidos, setPedidos] = useState<PedidoConDetalle[]>([]);

    useEffect(() => {
        const found = clientes.find(c => c.id === Number(id));
        if (found) setClient(found);

        const dir = direccionesCliente.find(d => d.clienteId === Number(id));
        if (dir) setDireccion(dir);

        listPedidosResumen().then(data => {
            const clientPedidos = data.filter(p => p.clienteId === Number(id));
            setPedidos(clientPedidos);
        });
    }, [id]);

    const teActivos = pedidos.some(p =>
        p.estado === 'ENTREGADO' ||
        p.estado === 'DEVUELTO' ||
        p.estado === 'PENDIENTE_REVISION'
    );

    const getEstadoBg = (estado: string) => {
        if (estado === 'PREPARADO') return { bg: AppColors.AquaClar, text: AppColors.AquaObscur };
        if (estado === 'ENTREGADO') return { bg: AppColors.VerdClar, text: AppColors.VerdObscur };
        if (estado === 'DEVUELTO') return { bg: AppColors.GrocClar, text: AppColors.GrocObscur };
        if (estado === 'PENDIENTE_REVISION') return { bg: AppColors.FucsiaClar, text: AppColors.FucsiaObscur };
        if (estado === 'FINALIZADO') return { bg: AppColors.MoratClar, text: AppColors.MoratObscur };
        return { bg: AppColors.BaseClar, text: AppColors.BaseMig };
    };

    if (!client) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>
                <Text className="text-festa-baseMig font-schibsted">Client no trobat</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ paddingVertical: insets.top + 16, paddingHorizontal: 30, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}
        >
            <VStack space="md">

                {/* Capçalera */}
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <ChevronLeft size={20} color={AppColors.Aqua} />
                        <Text className="text-festa-aqua font-schibsted">Clients</Text>
                    </Pressable>
                </HStack>

                {/* Nom i botons */}
                {isSmall ? (
                    <VStack space="xs">
                        <HStack style={{ justifyContent: 'flex-end' }}>
                            <HStack space="sm">
                                <Pressable
                                    onPress={() => router.push(`/(protected)/(tabs)/clients/new?id=${id}`)}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: AppColors.AquaClar, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, shadowColor: AppColors.BaseObscur, shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3 }}
                                >
                                    <Pencil size={14} color={AppColors.AquaObscur} />
                                    <Text style={{ color: AppColors.AquaObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>Editar</Text>
                                </Pressable>
                                <Pressable
                                    disabled={teActivos}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: teActivos ? AppColors.BaseClar : AppColors.FucsiaClar, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, opacity: teActivos ? 0.5 : 1, shadowColor: teActivos ? 'transparent' : AppColors.BaseObscur, shadowOffset: { width: 1, height: 2 }, shadowOpacity: teActivos ? 0 : 0.3, shadowRadius: 2, elevation: teActivos ? 0 : 3 }}
                                >
                                    <UserX size={14} color={teActivos ? AppColors.BaseMig : AppColors.FucsiaObscur} />
                                    <Text style={{ color: teActivos ? AppColors.BaseMig : AppColors.FucsiaObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>
                                        {teActivos ? 'Té pedidos actius' : 'Desactivar'}
                                    </Text>
                                </Pressable>
                            </HStack>
                        </HStack>
                        <HStack space="sm" style={{ alignItems: 'center', paddingTop: 15 }}>
                            <Text className="text-3xl font-fuzzy-bold text-festa-morat mr-5 flex">
                                {client.nombre}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: client.activo ? AppColors.VerdClar : AppColors.FucsiaClar, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, shadowColor: AppColors.BaseObscur, shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3 }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: client.activo ? AppColors.Verd : AppColors.Fucsia, shadowColor: AppColors.VerdObscur, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 2 }} />
                                <Text style={{ fontSize: 12, fontFamily: 'SchibstedGrotesk', color: client.activo ? AppColors.VerdObscur : AppColors.FucsiaObscur }}>
                                    {client.activo ? 'Actiu' : 'Inactiu'}
                                </Text>
                            </View>
                        </HStack>
                    </VStack>
                ) : (
                    <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <HStack space="sm" style={{ alignItems: 'center', flex: 1 }}>
                            <Text className="text-3xl font-fuzzy-bold text-festa-morat mr-5">
                                {client.nombre}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: client.activo ? AppColors.VerdClar : AppColors.FucsiaClar, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, shadowColor: AppColors.BaseObscur, shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3 }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: client.activo ? AppColors.Verd : AppColors.Fucsia, shadowColor: AppColors.VerdObscur, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 2 }} />
                                <Text style={{ fontSize: 12, fontFamily: 'SchibstedGrotesk', color: client.activo ? AppColors.VerdObscur : AppColors.FucsiaObscur }}>
                                    {client.activo ? 'Actiu' : 'Inactiu'}
                                </Text>
                            </View>
                        </HStack>
                        <HStack space="sm">
                            <Pressable
                                onPress={() => router.push(`/(protected)/(tabs)/clients/new?id=${id}`)}
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: AppColors.AquaClar, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, shadowColor: AppColors.BaseObscur, shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3 }}
                            >
                                <Pencil size={14} color={AppColors.AquaObscur} />
                                <Text style={{ color: AppColors.AquaObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>Editar</Text>
                            </Pressable>
                            <Pressable
                                disabled={teActivos}
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: teActivos ? AppColors.BaseClar : AppColors.FucsiaClar, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, opacity: teActivos ? 0.5 : 1, shadowColor: teActivos ? 'transparent' : AppColors.BaseObscur, shadowOffset: { width: 1, height: 2 }, shadowOpacity: teActivos ? 0 : 0.3, shadowRadius: 2, elevation: teActivos ? 0 : 3 }}
                            >
                                <UserX size={14} color={teActivos ? AppColors.BaseMig : AppColors.FucsiaObscur} />
                                <Text style={{ color: teActivos ? AppColors.BaseMig : AppColors.FucsiaObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>
                                    {teActivos ? 'Té pedidos actius' : 'Desactivar'}
                                </Text>
                            </Pressable>
                        </HStack>
                    </HStack>
                )}

                {/* Dades bàsiques */}
                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                    <VStack space="sm">
                        <Text className="text-xs font-schibsted text-festa-baseMig uppercase" style={{ letterSpacing: 1 }}>
                            Dades de contacte
                        </Text>
                        {client.telefono && (
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <Phone size={16} color={AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                    {client.telefono}
                                </Text>
                            </HStack>
                        )}
                        {client.email && (
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <Mail size={16} color={AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                    {client.email}
                                </Text>
                            </HStack>
                        )}
                        {client.nifCif && (
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <FileText size={16} color={AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                    {client.nifCif}
                                </Text>
                            </HStack>
                        )}
                        {direccion && (
                            <HStack space="sm" style={{ alignItems: 'flex-start' }}>
                                <MapPin size={16} color={AppColors.Morat} style={{ marginTop: 2 }} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur, flex: 1 }}>
                                    {direccion.linea1}{direccion.ciudad ? `, ${direccion.ciudad}` : ''}{direccion.codigoPostal ? ` ${direccion.codigoPostal}` : ''}
                                </Text>
                            </HStack>
                        )}
                        {client.notas && (
                            <HStack space="sm" style={{ alignItems: 'flex-start' }}>
                                <FileText size={16} color={AppColors.BaseMig} style={{ marginTop: 2 }} />
                                <Text className="font-schibsted text-festa-baseMig" style={{ flex: 1 }}>
                                    {client.notas}
                                </Text>
                            </HStack>
                        )}
                    </VStack>
                </Card>

                {/* Pedidos */}
                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                    <VStack space="sm">
                        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text className="text-xs font-schibsted text-festa-baseMig uppercase" style={{ letterSpacing: 1 }}>
                                Pedidos
                            </Text>
                            <HStack space="xs" style={{ alignItems: 'center' }}>
                                <Package size={13} color={AppColors.Fucsia} />
                                <Text className="text-sm font-schibsted text-festa-fucsia pr-1">{pedidos.length} en total</Text>
                            </HStack>
                        </HStack>

                        {pedidos.length === 0 ? (
                            <Text className="text-sm font-schibsted text-festa-baseMig" style={{ borderTopWidth: 1, borderTopColor: AppColors.MoratClar, paddingTop: 10 }}>
                                Aquest client no té pedidos
                            </Text>
                        ) : (
                            pedidos.slice(0, 5).map(pedido => {
                                const colors = getEstadoBg(pedido.estado);
                                return (
                                    <HStack key={pedido.id} style={{ justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: AppColors.MoratClar, paddingTop: 10 }}>
                                        <VStack space="xs" className="pb-1.5">
                                            <Text className="text-sm font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                                {pedido.codigo}
                                            </Text>
                                            <Text className="text-xs font-schibsted text-festa-baseMig">
                                                {pedido.fechaInicio} → {pedido.fechaFin}
                                            </Text>
                                        </VStack>
                                        <View style={{ backgroundColor: colors.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                                            <Text style={{ fontSize: 11, fontFamily: 'SchibstedGrotesk', color: colors.text }}>
                                                {pedido.estado}
                                            </Text>
                                        </View>
                                    </HStack>
                                );
                            })
                        )}
                    </VStack>
                </Card>

            </VStack>
        </ScrollView>
    );
}