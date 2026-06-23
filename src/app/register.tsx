import { AppButton, DiscoBall } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { RegisterFormValues, registerSchema } from '@/src/schemas/auth.schema';
import { authService } from '@/src/services';
import { useUserStore } from '@/src/stores/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { HStack } from '../components/ui/hstack';

export default function RegisterPage() {
    const { isDark } = useThemeContext();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { control, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            nombre: '',
            telefono: '',
            email: '',
            direccion: {
                linea1: '',
                ciudad: '',
                codigoPostal: '',
                esPrincipal: true,
            },
            password: '',
            confirmPassword: '',
        },
    });
    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isTallScreen = height > 800;

    const handleRegister = handleSubmit(async (data: RegisterFormValues) => {
        try {
            const result = await authService.register(data);

            if (!result.usuarioId) {
                setError('email', {
                    message: 'Error creant usuari',
                });
                return;
            }

            useUserStore.getState().setUser({
                id: result.usuarioId,
                clienteId: result.clienteId,
                name: data.nombre,
                email: data.email,
                role: 'CLIENT',
            });

            router.replace('/(protected)/(tabs)');
        } catch (err: any) {
            setError('email', {
                message: err.message ?? 'Error inesperat',
            });
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

                <Card className={`w-full max-w-xs lg:max-w-lg p-6 rounded-2xl shadow-lg elevation-lg ${isDark ? 'bg-festa-aquaObscur' : 'bg-festa-grocClar'}`}>
                    <VStack space="2xl">

                        {/* NOM */}
                        <FormControl isInvalid={!!errors.nombre}>
                            <FormControlLabel>
                                <FormControlLabelText>Nom</FormControlLabelText>
                            </FormControlLabel>

                            <Controller
                                control={control}
                                name="nombre"
                                render={({ field: { onChange, value } }) => (
                                    <Input className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
                                    ${isDark
                                            ? 'data-[focus=true]:border-festa-verd data-[focus=true]:hover:border-festa-verd'
                                            : 'data-[focus=true]:border-festa-aqua data-[focus=true]:hover:border-festa-aqua'
                                        }`}>
                                        <InputField
                                            placeholder="El teu nom"
                                            value={value}
                                            onChangeText={onChange}
                                            className="text-festa-baseObscur"
                                        />
                                    </Input>
                                )}
                            />

                            {errors.nombre && (
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.nombre.message}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* TELÈFON */}
                        <FormControl isInvalid={!!errors.telefono}>
                            <FormControlLabel>
                                <FormControlLabelText>Telèfon</FormControlLabelText>
                            </FormControlLabel>

                            <Controller
                                control={control}
                                name="telefono"
                                render={({ field: { onChange, value } }) => (
                                    <Input className="bg-festa-baseClar border-festa-baseMig">
                                        <InputField
                                            placeholder="612345678"
                                            value={value}
                                            keyboardType="phone-pad"
                                            onChangeText={onChange}
                                            className="text-festa-baseObscur"
                                        />
                                    </Input>
                                )}
                            />

                            {errors.telefono && (
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.telefono.message}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* EMAIL */}
                        <FormControl isInvalid={!!errors.email}>
                            <FormControlLabel>
                                <FormControlLabelText>Correu electrònic</FormControlLabelText>
                            </FormControlLabel>

                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
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
                                            className="text-festa-baseObscur"
                                        />
                                    </Input>
                                )}
                            />

                            {errors.email && (
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.email.message}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* ADREÇA */}
                        <FormControl isInvalid={!!errors.direccion?.linea1}>
                            <FormControlLabel>
                                <FormControlLabelText>Adreça</FormControlLabelText>
                            </FormControlLabel>

                            <Controller
                                control={control}
                                name="direccion.linea1"
                                render={({ field: { onChange, value } }) => (
                                    <Input className="bg-festa-baseClar border-festa-baseMig">
                                        <InputField
                                            placeholder="Carrer Exemple 123"
                                            value={value}
                                            onChangeText={onChange}
                                            className="text-festa-baseObscur"
                                        />
                                    </Input>
                                )}
                            />

                            {errors.direccion?.linea1 && (
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.direccion.linea1.message}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        <HStack className='justify-between'>

                            {/* CIUTAT */}
                            <FormControl isInvalid={!!errors.direccion?.ciudad}>
                                <FormControlLabel>
                                    <FormControlLabelText>Ciutat</FormControlLabelText>
                                </FormControlLabel>

                                <Controller
                                    control={control}
                                    name="direccion.ciudad"
                                    render={({ field: { onChange, value } }) => (
                                        <Input className="bg-festa-baseClar border-festa-baseMig">
                                            <InputField
                                                placeholder="Muro d'Alcoi"
                                                value={value}
                                                onChangeText={onChange}
                                                className="text-festa-baseObscur"
                                            />
                                        </Input>
                                    )}
                                />

                                {errors.direccion?.ciudad && (
                                    <FormControlError>
                                        <FormControlErrorText className="font-schibsted text-xs">
                                            {errors.direccion.ciudad.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            {/* CODI POSTAL */}
                            <FormControl isInvalid={!!errors.direccion?.codigoPostal}>
                                <FormControlLabel>
                                    <FormControlLabelText>Codi Postal</FormControlLabelText>
                                </FormControlLabel>

                                <Controller
                                    control={control}
                                    name="direccion.codigoPostal"
                                    render={({ field: { onChange, value } }) => (
                                        <Input className="bg-festa-baseClar border-festa-baseMig">
                                            <InputField
                                                placeholder="03830"
                                                value={value}
                                                keyboardType="numeric"
                                                onChangeText={onChange}
                                                className="text-festa-baseObscur"
                                            />
                                        </Input>
                                    )}
                                />

                                {errors.direccion?.codigoPostal && (
                                    <FormControlError>
                                        <FormControlErrorText className="font-schibsted text-xs">
                                            {errors.direccion.codigoPostal.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
                        </HStack>
                        {/* PASSWORD */}
                        <FormControl isInvalid={!!errors.password}>
                            <FormControlLabel>
                                <FormControlLabelText>Contrasenya</FormControlLabelText>
                            </FormControlLabel>

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <Input className="bg-festa-baseClar border-festa-baseMig">
                                        <InputField
                                            placeholder="********"
                                            secureTextEntry={!showPassword}
                                            value={value}
                                            autoCapitalize="none"
                                            onChangeText={onChange}
                                            className="text-festa-baseObscur"
                                        />
                                        <InputSlot onPress={() => setShowPassword(!showPassword)} className="pr-3">
                                            <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
                                        </InputSlot>
                                    </Input>
                                )}
                            />

                            {errors.password && (
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.password.message}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* CONFIRM PASSWORD */}
                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormControlLabel>
                                <FormControlLabelText>Confirmar contrasenya</FormControlLabelText>
                            </FormControlLabel>

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, value } }) => (
                                    <Input className="bg-festa-baseClar border-festa-baseMig">
                                        <InputField
                                            placeholder="********"
                                            secureTextEntry={!showConfirmPassword}
                                            value={value}
                                            autoCapitalize="none"
                                            onChangeText={onChange}
                                            className="text-festa-baseObscur"
                                        />
                                        <InputSlot onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-3">
                                            <InputIcon as={showConfirmPassword ? EyeOffIcon : EyeIcon} />
                                        </InputSlot>
                                    </Input>
                                )}
                            />

                            {errors.confirmPassword && (
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.confirmPassword.message}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* BOTÓ */}
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

                <Pressable className="mt-6" onPress={() => router.replace('/login')}>
                    <Text className="text-festa-baseMig text-sm mb-7">
                        Ja tens compte?{' '}
                        <Text className={`${isDark ? 'text-festa-verd' : 'text-festa-verdObscur'}`}>
                            Inicia sessió
                        </Text>
                    </Text>
                </Pressable>
            </View>

            <View />
        </ScrollView>
    );
}