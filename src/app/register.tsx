import { AppButton, DiscoBall } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { RegisterFormValues, registerSchema } from '@/src/schemas/auth.schema';
import { supabase } from '@/src/config/supabaseClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useUserStore } from '../stores/userStore';

export default function RegisterPage() {
    const { isDark } = useThemeContext();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { control, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { nombre: '', email: '', password: '', confirmPassword: '' },
    });
    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isTallScreen = height > 800;

    const handleRegister = handleSubmit(async (data: RegisterFormValues) => {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError('email', { message: error.message });
            return;
        }

        if (authData.user) {
            await supabase.from('usuarios').insert({
                auth_user_id: authData.user.id,
                nombre: data.nombre,
                email: data.email,
                id_rol: 1,
            });
            useUserStore.getState().setUser({
                id: 0,
                name: data.nombre,
                email: data.email,
                role: 'NORMAL',
            });
            router.replace('/(protected)/(tabs)');
        }
    });

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: isTallScreen ? 'flex-start' : 'space-between',
                paddingTop: isWeb ? 0 : 15,
                padding: 15,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
            }}
            keyboardShouldPersistTaps="handled"
        >
            <DiscoBall size={isWeb ? (isTallScreen ? 190 : 120) : 150} />
            <View style={{ alignItems: 'center', width: '100%', marginTop: isTallScreen ? 60 : 0 }}>
                <Text className="text-6xl md:text-5xl font-fuzzy-bold mt-2 text-festa-aqua">
                    TotFesta
                </Text>
                <Text className={`text-lg md:text-base mb-6 uppercase font-schibsted-italic text-center ${isDark ? 'text-festa-aquaClar' : 'text-festa-aquaObscur'}`}>
                    Lloga fàcil. Celebra gran.
                </Text>
                <Card className={`w-full max-w-xs lg:max-w-md p-6 rounded-2xl shadow-lg elevation-lg ${isDark ? 'bg-festa-aquaObscur' : 'bg-festa-grocClar'}`}>
                    <VStack space="2xl">
                        <FormControl isInvalid={!!errors.nombre}>
                            <FormControlLabel>
                                <FormControlLabelText>Nom</FormControlLabelText>
                            </FormControlLabel>
                            <Controller control={control} name="nombre" render={({ field: { onChange, value } }) => (
                                <Input className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
                                    ${isDark
                                        ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd'
                                        : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'
                                    }`}>
                                    <InputField
                                        placeholder="El teu nom"
                                        value={value}
                                        onChangeText={onChange}
                                        className='text-festa-baseObscur'
                                    />
                                </Input>
                            )} />
                            {errors.nombre && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.nombre.message}</FormControlErrorText></FormControlError>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                            <FormControlLabel>
                                <FormControlLabelText>Correu electrònic</FormControlLabelText>
                            </FormControlLabel>
                            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                                <Input className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
                                    ${isDark
                                        ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd'
                                        : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'
                                    }`}>
                                    <InputField
                                        placeholder="exemple@correu.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={value}
                                        onChangeText={(text) => onChange(text.trim())}
                                        className='text-festa-baseObscur'
                                    />
                                </Input>
                            )} />
                            {errors.email && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.email.message}</FormControlErrorText></FormControlError>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.password}>
                            <FormControlLabel>
                                <FormControlLabelText>Contrasenya</FormControlLabelText>
                            </FormControlLabel>
                            <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
                                <Input className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
                                    ${isDark
                                        ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd'
                                        : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'
                                    }`}>
                                    <InputField
                                        placeholder="********"
                                        secureTextEntry={!showPassword}
                                        value={value}
                                        autoCapitalize="none"
                                        onChangeText={onChange}
                                        className='text-festa-baseObscur'
                                    />
                                    <InputSlot onPress={() => setShowPassword(!showPassword)} className="pr-3">
                                        <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
                                    </InputSlot>
                                </Input>
                            )} />
                            {errors.password && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.password.message}</FormControlErrorText></FormControlError>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormControlLabel>
                                <FormControlLabelText>Confirmar contrasenya</FormControlLabelText>
                            </FormControlLabel>
                            <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
                                <Input className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
                                    ${isDark
                                        ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd'
                                        : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'
                                    }`}>
                                    <InputField
                                        placeholder="********"
                                        secureTextEntry={!showConfirmPassword}
                                        value={value}
                                        autoCapitalize="none"
                                        onChangeText={onChange}
                                        className='text-festa-baseObscur'
                                    />
                                    <InputSlot onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-3">
                                        <InputIcon as={showConfirmPassword ? EyeOffIcon : EyeIcon} />
                                    </InputSlot>
                                </Input>
                            )} />
                            {errors.confirmPassword && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.confirmPassword.message}</FormControlErrorText></FormControlError>}
                        </FormControl>
                        <AppButton
                            label="Registrar-se"
                            onPress={handleRegister}
                            bgColor={AppColors.Aqua}
                            textColor={AppColors.BaseObscur}
                            fontSize={15}
                            centered
                            shadow
                        />
                    </VStack>
                </Card>
                <Pressable className="mt-6" onPress={() => router.back()}>
                    <Text className="text-festa-baseMig text-sm mb-7">
                        Ja tens compte?{' '}
                        <Text className={`${isDark ? 'text-festa-verd' : 'text-festa-verdObscur'}`}>Inicia sessió</Text>
                    </Text>
                </Pressable>
            </View>
            <View />
        </ScrollView>
    );
}