import ConfirmDialog from '@/src/components/custom/ConfirmDialog';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { clientService } from '@/src/services/clientService';
import { Cliente, DireccionCliente, PedidoConDetalle, clientes, direccionesCliente, listPedidosResumen } from '@/src/types/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, FileText, IdCard, Mail, MapPin, Package, Pencil, Phone, UserCheck, UserX } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View, useColorScheme, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PedidoItem from '@/src/components/custom/PedidoItem';

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

    const [showConfirm, setShowConfirm] = useState(false);

    useFocusEffect(useCallback(() => {
        const found = clientes.find(c => c.id === Number(id));

        if (found) setClient(found);

        const dir = direccionesCliente.find(d => d.clienteId === Number(id));

        if (dir) setDireccion(dir);

        listPedidosResumen().then(data => {
            const clientPedidos = data.filter(p => p.clienteId === Number(id));
            setPedidos(clientPedidos);
        });
    }, [id]));

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
                                    onPress={() => setShowConfirm(true)}
                                    disabled={teActivos && client.activo}
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', gap: 6,
                                        backgroundColor: teActivos && client.activo ? AppColors.BaseClar : client.activo ? AppColors.FucsiaClar : AppColors.VerdClar,
                                        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                                        opacity: teActivos && client.activo ? 0.5 : 1,
                                        shadowColor: teActivos && client.activo ? 'transparent' : AppColors.BaseObscur,
                                        shadowOffset: { width: 1, height: 2 },
                                        shadowOpacity: teActivos && client.activo ? 0 : 0.3,
                                        shadowRadius: 2,
                                        elevation: teActivos && client.activo ? 0 : 3,
                                    }}
                                >
                                    {teActivos && client.activo
                                        ? <UserX size={14} color={AppColors.BaseMig} />
                                        : client.activo
                                            ? <UserX size={14} color={AppColors.FucsiaObscur} />
                                            : <UserCheck size={14} color={AppColors.VerdObscur} />
                                    }
                                    <Text style={{ color: teActivos && client.activo ? AppColors.BaseMig : client.activo ? AppColors.FucsiaObscur : AppColors.VerdObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>
                                        {teActivos && client.activo ? 'Té pedidos actius' : client.activo ? 'Desactivar' : 'Activar'}
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
                                onPress={() => setShowConfirm(true)}
                                disabled={teActivos && client.activo}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', gap: 6,
                                    backgroundColor: teActivos && client.activo ? AppColors.BaseClar : client.activo ? AppColors.FucsiaClar : AppColors.VerdClar,
                                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                                    opacity: teActivos && client.activo ? 0.5 : 1,
                                    shadowColor: teActivos && client.activo ? 'transparent' : AppColors.BaseObscur,
                                    shadowOffset: { width: 1, height: 2 },
                                    shadowOpacity: teActivos && client.activo ? 0 : 0.3,
                                    shadowRadius: 2,
                                    elevation: teActivos && client.activo ? 0 : 3,
                                }}
                            >
                                {teActivos && client.activo
                                    ? <UserX size={14} color={AppColors.BaseMig} />
                                    : client.activo
                                        ? <UserX size={14} color={AppColors.FucsiaObscur} />
                                        : <UserCheck size={14} color={AppColors.VerdObscur} />
                                }
                                <Text style={{ color: teActivos && client.activo ? AppColors.BaseMig : client.activo ? AppColors.FucsiaObscur : AppColors.VerdObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>
                                    {teActivos && client.activo ? 'Té pedidos actius' : client.activo ? 'Desactivar' : 'Activar'}
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
                                <IdCard size={16} color={AppColors.Morat} />
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
                            <VStack space="sm">
                                {pedidos.slice(0, 5).map(pedido => (
                                    <PedidoItem
                                        key={pedido.id}
                                        pedido={pedido}
                                        isDark={isDark}
                                        hasBorderTop={true}
                                    />
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </Card>

            </VStack>

            <ConfirmDialog
                visible={showConfirm}
                title={client.activo ? 'Desactivar client' : 'Activar client'}
                message={client.activo
                    ? `Vols desactivar ${client.nombre}?`
                    : `Vols activar ${client.nombre}?`
                }
                confirmText={client.activo ? 'Desactivar' : 'Activar'}
                onConfirm={() => {
                    clientService.update(
                        Number(id),
                        { ...client, activo: !client.activo },
                        direccion ?? { linea1: '', ciudad: '', codigoPostal: '', esPrincipal: true }
                    );
                    router.back();
                }}
                onClose={() => setShowConfirm(false)}
            />
        </ScrollView>
    );
}