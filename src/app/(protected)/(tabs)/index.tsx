import { Card } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { HStack } from '@/src/components/ui/hstack';
import { listPedidosActivos, listPedidosResumen } from '@/src/types/types';
import { useEffect, useState } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { AppColors } from '@/src/constants/colors';
import { PedidoConDetalle } from '@/src/types/types';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { Package, Users, ArrowRight } from 'lucide-react-native';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [pedidosActivos, setPedidosActivos] = useState<PedidoConDetalle[]>([]);
    const [totalPedidos, setTotalPedidos] = useState(0);

    const today = new Date().toLocaleDateString('ca-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

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
            }}
        >
            <VStack space="xl">

                {/* Capçalera */}
                <VStack space="xs">
                    <Text className="text-3xl font-fuzzy-bold text-festa-aqua">
                        Hola, Admin! 👋
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

                {/* Accés ràpid a Clients */}
                <Pressable onPress={() => router.push('/clients')}>
                    <Card className="p-4 rounded-2xl bg-festa-moratClar">
                        <HStack space="md" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <HStack space="md" style={{ alignItems: 'center' }}>
                                <Users size={24} color={AppColors.Morat} />
                                <VStack>
                                    <Text className="text-base font-schibsted text-festa-moratObscur">
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
                            <Card key={pedido.id} className={`p-4 rounded-2xl ${isDark ? 'bg-festa-baseMig' : 'bg-white'}`}>
                                <HStack space="md" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <VStack space="xs" style={{ flex: 1 }}>
                                        <Text className="text-sm font-schibsted" style={{ color: AppColors.BaseObscur }}>
                                            {pedido.codigo} — {pedido.cliente.nombre}
                                        </Text>
                                        <Text className={`text-xs font-schibsted ${isDark ? 'text-festa-baseObscur' : 'text-festa-baseMig'}`}>
                                            {pedido.lineas.length} productes · {pedido.totalUnidades} unitats
                                        </Text>
                                        <Text className={`text-xs font-schibsted ${isDark ? 'text-festa-baseObscur' : 'text-festa-baseMig'}`}>
                                            {pedido.fechaInicio} → {pedido.fechaFin}
                                        </Text>
                                    </VStack>
                                    <Text className={`text-xs font-schibsted px-2 py-1 rounded-full ${pedido.estado === 'PREPARADO' ? 'bg-festa-aquaClar text-festa-aquaObscur' :
                                        pedido.estado === 'ENTREGADO' ? 'bg-festa-verdClar text-festa-verdObscur' : pedido.estado === 'PENDIENTE_REVISION' ? 'bg-festa-grocClar text-festa-grocObscur' : 'bg-festa-fucsiaClar text-festa-fucsiaObscur'}
                                        `}>
                                        {pedido.estado}
                                    </Text>
                                </HStack>
                            </Card>
                        ))
                    )}
                </VStack>

            </VStack>
        </ScrollView>
    );
}