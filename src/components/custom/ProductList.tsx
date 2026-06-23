import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { Package } from 'lucide-react-native';

type Producte = {
    id: string | number;
    nombre: string;
    descripcion?: string | null;
    precioDia: number;
};

type Props = {
    productes: Producte[];
    isLoading?: boolean;
    isDark: boolean;
    emptyText?: string;
};

export default function ProducteList({
    productes,
    isLoading = false,
    isDark,
    emptyText = 'No hi ha productes disponibles',
}: Props) {
    if (isLoading) {
        return <ActivityIndicator size="large" color={AppColors.Aqua} style={{ marginTop: 24 }} />;
    }

    if (!productes.length) {
        return (
            <Text className="text-sm font-schibsted text-festa-baseMig">
                {emptyText}
            </Text>
        );
    }

    return (
        <FlatList
            data={productes}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
                <Card
                    className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}
                    style={{ marginBottom: 12 }}
                >
                    <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <HStack space="md" style={{ alignItems: 'center', flex: 1 }}>
                            <Package size={20} color={AppColors.Morat} />
                            <VStack style={{ flex: 1 }}>
                                <Text
                                    className={`font-schibsted text-base ${isDark ? 'text-festa-baseClar' : 'text-festa-baseObscur'
                                        }`}
                                >
                                    {item.nombre}
                                </Text>
                                {item.descripcion ? (
                                    <Text className="text-xs font-schibsted text-festa-baseMig">
                                        {item.descripcion}
                                    </Text>
                                ) : null}
                            </VStack>
                        </HStack>

                        <Text className="text-festa-aqua font-fuzzy-bold text-base">
                            {item.precioDia}€/dia
                        </Text>
                    </HStack>
                </Card>
            )}
        />
    );
}