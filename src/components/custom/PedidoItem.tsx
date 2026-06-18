import { View } from 'react-native';
import { HStack } from '@/src/components/ui/hstack';
import { VStack } from '@/src/components/ui/vstack';
import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';
import { PedidoConDetalle } from '@/src/types/types';
import { getEstadoBg, getEstadoLabel } from '@/src/utils/pedidoUtils';

interface PedidoItemProps {
    pedido: PedidoConDetalle;
    isDark: boolean;
    hasBorderTop?: boolean;
}

export default function PedidoItem({ pedido, isDark, hasBorderTop = false }: PedidoItemProps) {
    const colors = getEstadoBg(pedido.estado);
    const label = getEstadoLabel(pedido.estado);

    return (
        <View
            style={{
                width: '100%',
                borderTopWidth: hasBorderTop ? 1 : 0,
                borderTopColor: hasBorderTop ? AppColors.MoratClar : 'transparent',
                paddingTop: hasBorderTop ? 12 : 6,
                paddingBottom: 6,
            }}
        >
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <VStack space="xs" style={{ flex: 1, paddingLeft: 4 }}>
                    <Text className={`text-sm font-schibsted ${isDark ? 'text-festa-baseClar' : 'text-festa-baseObscur'}`}>
                        {pedido.codigo}
                        {pedido.cliente?.nombre && ` — ${pedido.cliente.nombre}`}
                    </Text>

                    {pedido.lineas && (
                        <Text className={`text-xs font-schibsted text-festa-baseMig`}>
                            {pedido.lineas.length} productes · {pedido.totalUnidades} unitats
                        </Text>
                    )}

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
        </View>
    );
}