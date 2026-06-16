import { ClientStatusBadge } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { Cliente } from '@/src/types/types';
import { Mail, Package, Phone } from 'lucide-react-native';
import { Pressable, View, useColorScheme } from 'react-native';

interface ClientCardProps {
    client: Cliente;
    pedidosCount: number;
    isSmall: boolean;
    onPress: () => void;
}

export default function ClientCard({ client, pedidosCount, isSmall, onPress }: ClientCardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Card className={`p-4 rounded-2xl shadow-sm hover:bg-festa-aquaClar ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
            <Pressable onPress={onPress}>
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
                        <ClientStatusBadge activo={client.activo} />
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
            </Pressable>
        </Card>
    );
}