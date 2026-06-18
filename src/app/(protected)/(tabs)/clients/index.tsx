import { AppButton, ClientCard } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers/ThemeProvider';
import { clientService } from '@/src/services/clientService';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Plus, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClientsScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();

    const [search, setSearch] = useState('');
    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    const { data: clients = [], isLoading, isError } = useQuery({
        queryKey: ['clientes'],
        queryFn: clientService.getAll,
    });

    const filtered = clients.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.telefono?.includes(search)
    );

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar, paddingTop: insets.top, paddingBottom: insets.bottom }}>

            <View style={{ padding: 16, paddingBottom: 8 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text className="text-3xl font-fuzzy-bold text-festa-aqua">Clients</Text>
                    {!isSmall && (
                        <AppButton
                            label="Afegir client"
                            onPress={() => router.push('/(protected)/(tabs)/clients/new')}
                            icon={Plus}
                            bgColor={AppColors.Aqua}
                            textColor={AppColors.BaseObscur}
                            shadow
                        />
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
                        className='text-festa-baseObscur'
                    />
                    {search.length > 0 && (
                        <InputSlot className="pr-3" onPress={() => setSearch('')}>
                            <InputIcon as={X} />
                        </InputSlot>
                    )}
                </Input>
            </View>

            {/* Llistat */}
            {isLoading && (
                <ActivityIndicator size="large" color={AppColors.Aqua} style={{ marginTop: 24 }} />
            )}
            {isError && (
                <Text className="text-center text-festa-fucsia font-schibsted p-4">
                    Error carregant els clients
                </Text>
            )}
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
                <VStack space="md">
                    {filtered.length === 0 ? (
                        <Card className="p-6 rounded-2xl">
                            <Text className="text-center text-festa-baseMig font-schibsted">
                                No s'han trobat clients
                            </Text>
                        </Card>
                    ) : (
                        filtered.map(client => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                pedidosCount={client.pedidosCount ?? 0}
                                isSmall={isSmall}
                                onPress={() => router.push({ pathname: '/clients/[id]', params: { id: client.id } })}
                            />
                        ))
                    )}
                </VStack>
            </ScrollView>

            {isSmall && (
                <Pressable
                    onPress={() => router.push('/(protected)/(tabs)/clients/new')}
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