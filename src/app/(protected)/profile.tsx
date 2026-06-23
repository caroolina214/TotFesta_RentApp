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
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ProfileScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    const { name, email, role, updateName } = useUserStore();
    const { logout } = useAuth();
    const [editName, setEditName] = useState(name);

    const closeBtn = <AppButton
        label="Tancar sessió"
        onPress={logout}
        bgColor={AppColors.FucsiaClar}
        textColor={AppColors.FucsiaObscur}
        iconColor={AppColors.FucsiaObscur}
        icon={LogOut}
        shadow
        centered
    />

    const titlePage = <Text className="text-3xl font-fuzzy-bold text-festa-morat">
        El meu perfil
    </Text>

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [localUri, setLocalUri] = useState<string | null>(null);

    const pickAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setLocalUri(result.assets[0].uri);
        }
    };

    const [telefono, setTelefono] = useState('');
    const [linea1, setLinea1] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [loadingClient, setLoadingClient] = useState(false);

    const handleSave = async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id;

        if (localUri) {
            console.log('localUri:', localUri);
            const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
            console.log('ext:', ext);
            const contentType = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
            const fileName = `${userId}.jpg`;

            let uploadData: any;
            if (Platform.OS === 'web') {
                const file = await fetch(localUri);
                uploadData = await file.blob();
            } else {
                const FileSystem = await import('expo-file-system/legacy');
                const base64 = await FileSystem.readAsStringAsync(localUri, {
                    encoding: 'base64',
                });
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                uploadData = bytes;
            }

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, uploadData, { upsert: true, contentType });
            console.log('uploadError:', uploadError);
            console.log('uploadData type:', typeof uploadData, uploadData?.byteLength);

            if (!uploadError) {
                const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
                const urlWithTimestamp = `${data.publicUrl}?t=${Date.now()}`;
                await supabase.from('usuarios')
                    .update({ avatar_url: urlWithTimestamp })
                    .eq('auth_user_id', userId);
                setAvatarUrl(urlWithTimestamp);
            }
        }

        const { error } = await supabase
            .from('usuarios')
            .update({ nombre: editName })
            .eq('auth_user_id', userId);

        if (!error) {
            updateName(editName);
            router.back();
        }
    };

    useEffect(() => {
        const loadAvatar = async () => {
            const { data: user } = await supabase.auth.getUser();
            if (user.user) {
                const { data } = await supabase
                    .from('usuarios')
                    .select('avatar_url')
                    .eq('auth_user_id', user.user.id)
                    .maybeSingle();
                if (data?.avatar_url) setAvatarUrl(data.avatar_url);
            }
        };
        loadAvatar();
    }, []);

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
                    {!isSmall && titlePage}
                    <HStack className='gap-2'>
                        <AppButton
                            label="Guardar"
                            onPress={handleSave}
                            icon={Save}
                            bgColor={AppColors.AquaClar}
                            textColor={AppColors.AquaObscur}
                            shadow
                        />
                        {!isSmall && closeBtn}
                    </HStack>
                </HStack>
                <VStack className={`gap-4 mt-4 ${isSmall ? 'flex-col items-center' : 'flex-row items-start'}`}>
                    {isSmall && titlePage}
                    {/* Avatar */}
                    <Pressable onPress={pickAvatar} style={{ alignItems: 'center', position: 'relative' }}>
                        {({ hovered }: any) => (
                            <>
                                {(localUri || avatarUrl) ? (
                                    <Image source={{ uri: localUri ?? avatarUrl! }} style={{ width: 180, height: 180, borderRadius: 100, opacity: hovered ? 0.7 : 1 }} />
                                ) : (
                                    <VStack style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: AppColors.MoratClar, alignItems: 'center', justifyContent: 'center', opacity: hovered ? 0.7 : 1 }}>
                                        <Text className="text-3xl font-fuzzy-bold text-festa-morat">{name?.charAt(0).toUpperCase()}</Text>
                                    </VStack>
                                )}
                                {hovered && (
                                    <VStack style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 12, fontFamily: 'SchibstedGrotesk' }}>Canviar foto</Text>
                                    </VStack>
                                )}
                            </>
                        )}
                    </Pressable>

                    {/* Dades usuari */}
                    <Card style={{ flex: isSmall ? undefined : 1 }} className={`p-4 rounded-2xl w-full ${isDark ? 'bg-festa-aquaObscur' : 'bg-white'}`}>
                        <VStack space="md">
                            <Text className={`text-xs font-schibsted uppercase tracking-widest ${isDark ? 'text-festa-aquaClar' : 'text-festa-baseMig'}`}>Dades personals</Text>
                            <VStack space="xs">
                                <Text className="text-sm font-schibsted text-festa-baseMig">Nom complet</Text>
                                <Input className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0 ${isDark ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd' : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'}`}>
                                    <InputField value={editName} onChangeText={setEditName} placeholder="El teu nom" className='text-festa-baseObscur' />
                                </Input>
                            </VStack>
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <Mail size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                                <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>{email}</Text>
                            </HStack>
                            <HStack space="sm" style={{ alignItems: 'center' }}>
                                <Shield size={16} color={isDark ? AppColors.Aqua : AppColors.Morat} />
                                <Text className={`font-schibsted ${isDark ? 'text-festa-aqua' : 'text-festa-baseMig'}`}>
                                    {role === 'ADMIN' ? 'Administrador' : role === 'CLIENT' ? 'Client' : 'Operari'}
                                </Text>
                            </HStack>
                        </VStack>
                    </Card>
                </VStack>
                {isSmall && closeBtn}
            </VStack>
        </ScrollView>
    );
}