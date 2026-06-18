import { AppButton } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { HStack } from '@/src/components/ui/hstack';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { supabase } from '@/src/config/supabaseClient';
import { AppColors } from '@/src/constants/colors';
import { useAuth, useThemeContext } from '@/src/providers';
import { useUserStore } from '@/src/stores/userStore';
import { router } from 'expo-router';
import { ChevronLeft, LogOut, Mail, Save, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();

    const { name, email, role, updateName } = useUserStore();
    const { logout } = useAuth();
    const [editName, setEditName] = useState(name);

    const handleSave = async () => {
        const { error } = await supabase
            .from('usuarios')
            .update({ nombre: editName })
            .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id);
        if (!error) {
            updateName(editName);
            router.back();
        }
    };

    return (
        <ScrollView contentContainerStyle={{
            paddingVertical: insets.top + 16,
            paddingHorizontal: 24,
            backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
            flexGrow: 1
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

                <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-aquaObscur' : 'bg-white'}`}>
                    <VStack space="md">
                        <Text className={`text-xs font-schibsted uppercase tracking-widest ${isDark ? 'text-festa-aquaClar' : 'text-festa-baseMig'}`}>
                            Dades personals
                        </Text>

                        <VStack space="xs">
                            <Text className="text-sm font-schibsted text-festa-baseMig">Nom complet</Text>
                            <Input
                                className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
                                    ${isDark
                                        ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd'
                                        : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'
                                    }`}>
                                <InputField
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="El teu nom"
                                    className='text-festa-baseObscur'
                                />
                            </Input>
                        </VStack>

                        <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Mail size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                            <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                {email}
                            </Text>
                        </HStack>

                        <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Shield size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                            <Text className={`font-schibsted ${isDark ? 'text-festa-aqua' : 'text-festa-baseMig'}`}>
                                {role === 'ADMIN' ? 'Administrador' : 'Operari'}
                            </Text>
                        </HStack>
                    </VStack>
                </Card>
                <AppButton
                    label="Tancar sessió"
                    onPress={logout}
                    bgColor={AppColors.FucsiaClar}
                    textColor={AppColors.FucsiaObscur}
                    iconColor={AppColors.FucsiaObscur}
                    icon={LogOut}
                    shadow
                    centered
                />
            </VStack>
        </ScrollView>
    );
}