import { AppButton } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useUserStore } from '@/src/stores/userStore';
import { router } from 'expo-router';
import { ChevronLeft, Mail, Save, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const { name, email, role, updateName } = useUserStore();
    const [editName, setEditName] = useState(name);

    const handleSave = () => {
        updateName(editName);
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={{
            paddingVertical: insets.top + 16,
            paddingHorizontal: 24,
            backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
        }}>
            <VStack space="md">
                {/* Capçalera */}
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <AppButton
                        label="Tornar"
                        onPress={() => router.replace('/(protected)/(tabs)')}
                        icon={ChevronLeft}
                        bgColor="transparent"
                        textColor={AppColors.Aqua}
                        iconColor={AppColors.Aqua}
                    />
                    <AppButton
                        label="Guardar"
                        onPress={handleSave}
                        icon={Save}
                        bgColor={AppColors.AquaClar}
                        textColor={AppColors.AquaObscur}
                        shadow
                    />
                </HStack>

                <Text className="text-3xl font-fuzzy-bold text-festa-morat">
                    El meu perfil
                </Text>

                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                    <VStack space="md">
                        <Text className="text-xs font-schibsted text-festa-baseMig uppercase" style={{ letterSpacing: 1 }}>
                            Dades personals
                        </Text>

                        <VStack space="xs">
                            <Text className="text-sm font-schibsted text-festa-baseMig">Nom visible</Text>
                            <Input className={`border-festa-baseMig data-[focus=true]:border-festa-morat data-[focus=true]:web:ring-0 ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                                <InputField
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="El teu nom"
                                />
                            </Input>
                        </VStack>

                        <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Mail size={16} color={AppColors.Morat} />
                            <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                {email}
                            </Text>
                        </HStack>

                        <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Shield size={16} color={AppColors.Morat} />
                            <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                {role === 'ADMIN' ? 'Administrador' : 'Operari'}
                            </Text>
                        </HStack>
                    </VStack>
                </Card>
            </VStack>
        </ScrollView>
    );
}