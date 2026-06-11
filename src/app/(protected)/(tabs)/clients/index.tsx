import { listClientes, listPedidosResumen } from '@/src/types/types';
import { PedidoConDetalle } from '@/src/types/types';
import { Phone, Mail, Package } from 'lucide-react-native';
import { useWindowDimensions } from 'react-native';
import { Card } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { HStack } from '@/src/components/ui/hstack';
import { VStack } from '@/src/components/ui/vstack';
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input';
import { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/src/constants/colors';
import { Cliente } from '@/src/types/types';
import { Search, Plus, X } from 'lucide-react-native';

export default function ClientsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [clients, setClients] = useState<Cliente[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        listClientes().then(setClients);
    }, []);

    const filtered = clients.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.telefono?.includes(search)
    );

    const [pedidos, setPedidos] = useState<PedidoConDetalle[]>([]);
    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    useEffect(() => {
        listClientes().then(setClients);
        listPedidosResumen().then(setPedidos);
    }, []);

    const getPedidosCount = (clientId: number) =>
        pedidos.filter(p => p.clienteId === clientId).length;

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>

            <View style={{ padding: 16, paddingBottom: 8 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text className="text-2xl font-fuzzy-bold text-festa-aqua">Clients</Text>
                    {!isSmall && (
                        <Pressable
                            // onPress={() => router.push('/(protected)/(tabs)/clients/new')}
                            style={{ backgroundColor: AppColors.Aqua, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                        >
                            <Plus size={16} color={AppColors.BaseObscur} />
                            <Text style={{ color: AppColors.BaseObscur, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>Afegir client</Text>
                        </Pressable>
                    )}
                </HStack>

                <Input className="bg-festa-grocClar shadow-sm shadow-festa-baseMig border-festa-grocClar
                data-[hover=true]:border-festa-grocClar
                data-[focus=true]:border-festa-grocObscur
                data-[focus=true]:hover:border-festa-grocObscur
                data-[focus=true]:web:ring-0
                ">
                    <InputSlot className="pl-3">
                        <InputIcon as={Search} />
                    </InputSlot>
                    <InputField
                        placeholder="Buscar per nom, email o telèfon..."
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize="none"
                    />
                    {search.length > 0 && (
                        <InputSlot className="pr-3" onPress={() => setSearch('')}>
                            <InputIcon as={X} />
                        </InputSlot>
                    )}
                </Input>
            </View>

            {/* Llistat */}
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
                <VStack space="sm">
                    {filtered.length === 0 ? (
                        <Card className="p-6 rounded-2xl">
                            <Text className="text-center text-festa-baseMig font-schibsted">
                                No s'han trobat clients
                            </Text>
                        </Card>
                    ) : (
                        filtered.map(client => {
                            const pedidosCount = getPedidosCount(client.id);
                            return (
                                <Pressable key={client.id} onPress={() => router.push(`/(protected)/(tabs)/clients/${client.id}`)}>
                                    <Card className={`p-4 rounded-2xl shadow-sm hover:bg-festa-aquaClar ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                                        <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <VStack space="xs" style={{ flex: 1 }}>
                                                <Text className="font-schibsted text-base" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                                    {client.nombre}
                                                </Text>

                                                {!isSmall ? (
                                                    <HStack space="md" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                                        {client.telefono && (
                                                            <HStack space="xs" style={{ alignItems: 'center' }}>
                                                                <Phone size={13} color={AppColors.Morat} />
                                                                <Text className="text-sm font-schibsted text-festa-baseMig">{client.telefono}</Text>
                                                            </HStack>
                                                        )}
                                                        {client.email && (
                                                            <HStack space="xs" style={{ alignItems: 'center' }}>
                                                                <Mail size={13} color={AppColors.Morat} />
                                                                <Text className="text-sm font-schibsted text-festa-baseMig">{client.email}</Text>
                                                            </HStack>
                                                        )}
                                                    </HStack>
                                                ) : (
                                                    <VStack space="xs">
                                                        {client.telefono && (
                                                            <HStack space="xs" style={{ alignItems: 'center' }}>
                                                                <Phone size={13} color={AppColors.Morat} />
                                                                <Text className="text-sm font-schibsted text-festa-baseMig">{client.telefono}</Text>
                                                            </HStack>
                                                        )}
                                                        {client.email && (
                                                            <HStack space="xs" style={{ alignItems: 'center' }}>
                                                                <Mail size={13} color={AppColors.Morat} />
                                                                <Text className="text-sm font-schibsted text-festa-baseMig">{client.email}</Text>
                                                            </HStack>
                                                        )}
                                                    </VStack>
                                                )}

                                                {!isSmall && (
                                                    <HStack space="xs" style={{ alignItems: 'center', marginTop: 2 }}>
                                                        <Package size={13} color={AppColors.Aqua} />
                                                        <Text className="text-sm font-schibsted text-festa-aqua">{pedidosCount} pedidos</Text>
                                                    </HStack>
                                                )}
                                            </VStack>

                                            <VStack space="xs" style={{ alignItems: 'flex-end' }}>
                                                <View style={{
                                                    backgroundColor: client.activo ? AppColors.VerdClar : AppColors.FucsiaClar,
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 3,
                                                    borderRadius: 20,
                                                }}>
                                                    <Text style={{
                                                        fontSize: 11,
                                                        fontFamily: 'SchibstedGrotesk',
                                                        color: client.activo ? AppColors.VerdObscur : AppColors.FucsiaObscur,
                                                    }}>
                                                        {client.activo ? 'Actiu' : 'Inactiu'}
                                                    </Text>
                                                </View>
                                                {isSmall && (
                                                    <View style={{
                                                        backgroundColor: AppColors.AquaClar,
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 2,
                                                        borderRadius: 20,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                    }}>
                                                        <Text style={{ fontSize: 11, fontFamily: 'SchibstedGrotesk', color: AppColors.AquaObscur }}>
                                                            {pedidosCount}
                                                        </Text>
                                                        <Package size={11} color={AppColors.AquaObscur} />
                                                    </View>
                                                )}
                                            </VStack>
                                        </HStack>
                                    </Card>
                                </Pressable>
                            );
                        })
                    )}
                </VStack>
            </ScrollView>

            {isSmall && (
                <Pressable
                    // onPress={() => router.push('/(protected)/(tabs)/clients/new')}
                    style={{
                        position: 'absolute',
                        bottom: 24,
                        right: 24,
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: AppColors.Aqua,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 6,
                        shadowColor: AppColors.AquaObscur,
                        shadowOffset: { width: 2, height: 3 },
                        shadowOpacity: 0.45,
                        shadowRadius: 6,
                    }}
                >
                    <Plus size={24} color={AppColors.BaseObscur} />
                </Pressable>
            )}

        </View>
    );
}