import { PedidoItem } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { listPedidosActivos, listPedidosResumen, PedidoConDetalle } from '@/src/types/types';
import { router } from 'expo-router';
import { ArrowRight, Package, User, Users, Settings } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/src/stores/userStore';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const [pedidosActivos, setPedidosActivos] = useState<PedidoConDetalle[]>([]);
    const [totalPedidos, setTotalPedidos] = useState(0);

    const today = new Date().toLocaleDateString('ca-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const { name, role } = useUserStore();

    useEffect(() => {
        listPedidosActivos().then(setPedidosActivos);
        listPedidosResumen().then((data: PedidoConDetalle[]) => setTotalPedidos(data.length));
    }, []);

    const recollidesPendents = pedidosActivos.filter(
        (p) => p.estado === 'ENTREGADO'
    ).length;

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 24,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
                paddingTop: insets.top + 15,
                paddingBottom: insets.bottom,
            }}
        >
            <VStack space="xl">

                {/* Capçalera */}
                <VStack space="xs">
                    <Text className="text-3xl font-fuzzy-bold text-festa-aqua">
                        Hola, {name}! 👋
                    </Text>
                    <Text className="text-sm font-schibsted text-festa-baseMig capitalize">
                        {today}
                    </Text>
                </VStack>

                {/* Resum */}
                <HStack space="md">
                    <Card className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-festa-baseMig' : 'bg-white'}`}>
                        <VStack space="xs">
                            <Text className={`text-xs font-schibsted ${isDark ? 'text-festa-baseObscur' : 'text-festa-baseMig'}`}>
                                Pedidos actius
                            </Text>
                            <Text className={`text-2xl font-fuzzy-bold flex items-baseline gap-2 ${isDark ? 'text-festa-aquaObscur' : 'text-festa-aqua'}`}>
                                <Package size={20} color={isDark ? AppColors.AquaObscur : AppColors.Aqua} />
                                {pedidosActivos.length}
                            </Text>
                        </VStack>
                    </Card>

                    <Card className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-festa-baseMig' : 'bg-white'}`}>
                        <VStack space="xs">
                            <Text className={`text-xs font-schibsted ${isDark ? 'text-festa-baseObscur' : 'text-festa-baseMig'}`}>
                                Recollides pendents
                            </Text>
                            <Text className={`text-2xl font-fuzzy-bold flex items-baseline gap-2 ${isDark ? 'text-festa-fucsiaObscur' : 'text-festa-fucsia'}`}>
                                <Package size={20} color={isDark ? AppColors.FucsiaObscur : AppColors.Fucsia} />
                                {recollidesPendents}
                            </Text>
                        </VStack>
                    </Card>
                </HStack>

                {/* Accés ràpid */}
                <VStack space="sm">
                    {role === 'ADMIN' && (
                        <Pressable onPress={() => router.push('/clients')}>
                            <Card className="p-4 rounded-2xl bg-festa-moratClar">
                                <HStack space="md" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                    <HStack space="md" style={{ alignItems: 'center' }}>
                                        <Users size={24} color={AppColors.Morat} />
                                        <VStack>
                                            <Text className="text-base font-schibsted text-festa-baseObscur">
                                                Gestió de Clients
                                            </Text>
                                            <Text className="text-xs font-schibsted text-festa-morat">
                                                Veure, crear i editar clients
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <ArrowRight size={20} color={AppColors.Morat} />
                                </HStack>
                            </Card>
                        </Pressable>
                    )}
                    <Pressable onPress={() => router.push('/(protected)/profile')}>
                        <Card className="p-4 rounded-2xl bg-festa-aquaClar">
                            <HStack space="md" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <HStack space="md" style={{ alignItems: 'center' }}>
                                    <User size={24} color={AppColors.Aqua} />
                                    <VStack>
                                        <Text className="text-base font-schibsted text-festa-baseObscur">
                                            El meu perfil
                                        </Text>
                                        <Text className="text-xs font-schibsted text-festa-aqua">
                                            Veure i editar les meues dades
                                        </Text>
                                    </VStack>
                                </HStack>
                                <ArrowRight size={20} color={AppColors.Aqua} />
                            </HStack>
                        </Card>
                    </Pressable>
                    <Pressable onPress={() => router.push('/(protected)/preferences')}>
                        <Card className="p-4 rounded-2xl bg-festa-grocClar">
                            <HStack space="md" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <HStack space="md" style={{ alignItems: 'center' }}>
                                    <Settings size={24} color={AppColors.GrocObscur} />
                                    <VStack>
                                        <Text className="text-base font-schibsted text-festa-baseObscur">
                                            Preferències
                                        </Text>
                                        <Text className="text-xs font-schibsted text-festa-grocObscur">
                                            Tema i configuració general
                                        </Text>
                                    </VStack>
                                </HStack>
                                <ArrowRight size={20} color={AppColors.GrocObscur} />
                            </HStack>
                        </Card>
                    </Pressable>
                </VStack>

                {/* Operativa del dia */}
                <VStack space="md">
                    <Text className="text-lg font-fuzzy-bold text-festa-aqua">
                        Operativa prevista per avui
                    </Text>

                    {pedidosActivos.length === 0 ? (
                        <Card className="p-4 rounded-2xl">
                            <Text className="text-sm font-schibsted text-festa-baseMig text-center">
                                No hi ha pedidos actius per avui
                            </Text>
                        </Card>
                    ) : (
                        pedidosActivos.map((pedido) => (
                            <Card className="px-3 py-1 rounded-2xl" key={pedido.id}>
                                <PedidoItem pedido={pedido} isDark={isDark} />
                            </Card>
                        ))
                    )}
                </VStack>
                <View />
            </VStack>
        </ScrollView>
    );
}