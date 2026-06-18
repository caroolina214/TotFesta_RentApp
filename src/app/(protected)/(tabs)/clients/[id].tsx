import { AppButton, ClientStatusBadge, ConfirmDialog, PedidoItem } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers/ThemeProvider';
import { clientService } from '@/src/services';
import { Cliente, DireccionCliente, PedidoConDetalle, clientes, direccionesCliente, listPedidosResumen } from '@/src/types/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, FileText, IdCard, Mail, MapPin, Package, Pencil, Phone, UserCheck, UserX } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClientDetailScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();

    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    const { id } = useLocalSearchParams<{ id: string }>();
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

    if (!client) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>
                <Text className="text-festa-baseMig font-schibsted">Client no trobat</Text>
            </View>
        );
    }

    const editButton = (
        <AppButton
            label="Editar"
            onPress={() => router.push(`/(protected)/(tabs)/clients/new?id=${id}`)}
            icon={Pencil}
            bgColor={AppColors.AquaClar}
            textColor={AppColors.AquaObscur}
            shadow
        />
    );

    const toggleButton = (
        <AppButton
            label={teActivos && client.activo ? 'Té pedidos actius' : client.activo ? 'Desactivar' : 'Activar'}
            onPress={() => setShowConfirm(true)}
            icon={teActivos && client.activo ? UserX : client.activo ? UserX : UserCheck}
            bgColor={teActivos && client.activo ? AppColors.BaseClar : client.activo ? AppColors.FucsiaClar : AppColors.VerdClar}
            textColor={teActivos && client.activo ? AppColors.BaseMig : client.activo ? AppColors.FucsiaObscur : AppColors.VerdObscur}
            disabled={teActivos && client.activo}
            shadow={!(teActivos && client.activo)}
        />
    );

    return (
        <ScrollView
            contentContainerStyle={{
                paddingVertical: insets.top + 16,
                paddingHorizontal: isSmall ? 20 : 30,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
                flexGrow: 1
            }}
        >
            <VStack space="md">
                <HStack>
                    <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <ChevronLeft size={20} color={AppColors.Aqua} />
                        <Text className="text-festa-aqua font-schibsted">Clients</Text>
                    </Pressable>
                </HStack>

                {/* Nom i botons */}
                {isSmall ? (
                    <VStack space="xs">
                        <HStack style={{ justifyContent: 'flex-end', gap: 8 }}>
                            {editButton}
                            {toggleButton}
                        </HStack>
                        <HStack space="sm" style={{ alignItems: 'center', paddingTop: 15 }}>
                            <Text className={`text-3xl font-fuzzy-bold  mr-5 flex ${isDark ? 'text-festa-moratClar' : 'text-festa-morat'}`}>{client.nombre}</Text>
                            <ClientStatusBadge activo={client.activo} />
                        </HStack>
                    </VStack>
                ) : (
                    <HStack style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <HStack space="sm" style={{ alignItems: 'center', flex: 1 }}>
                            <Text className="text-3xl font-fuzzy-bold text-festa-morat mr-5">{client.nombre}</Text>
                            <ClientStatusBadge activo={client.activo} />
                        </HStack>
                        {editButton}
                        {toggleButton}
                    </HStack>
                )}

                {/* Dades bàsiques */}
                <Card className={`p-4 rounded-2xl shadow-sm elevation-sm ${isDark ? 'bg-festa-aquaObscur shadow-festa-baseClar' : 'bg-white'}`}>
                    <VStack space="sm">
                        <Text className="text-xs font-schibsted text-festa-baseMig uppercase tracking-widest">
                            Dades de contacte
                        </Text>
                        {client.telefono && (
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <Phone size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                    {client.telefono}
                                </Text>
                            </HStack>
                        )}
                        {client.email && (
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <Mail size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                    {client.email}
                                </Text>
                            </HStack>
                        )}
                        {client.nifCif && (
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <IdCard size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                    {client.nifCif}
                                </Text>
                            </HStack>
                        )}
                        {direccion && (
                            <HStack space="sm" style={{ alignItems: 'flex-start' }}>
                                <MapPin size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} style={{ marginTop: 2 }} />
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
                <Card className={`p-4 rounded-2xl mt-4 ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
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