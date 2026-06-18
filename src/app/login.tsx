import { AppButton, DiscoBall } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useAuth, useThemeContext } from '@/src/providers';
import { LoginFormValues, loginSchema } from '@/src/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

export default function LoginPage() {
    const { isDark } = useThemeContext();

    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isTallScreen = height > 800;

    const { login } = useAuth();
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = handleSubmit(async (data: LoginFormValues) => {
        const success = await login(data.email, data.password);
        if (success) {
            router.replace('/(protected)/(tabs)');
        } else {
            setError('email', { message: 'Correu o contrasenya incorrectes' });
            setError('password', { message: 'Correu o contrasenya incorrectes' });
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
                <Card className={`w-full max-w-xs lg:max-w-md p-6 rounded-2xl shadow-lg elevation-lg ${isDark ? 'bg-festa-aquaObscur' : 'bg-festa-grocClar'} `}>
                    <VStack space="2xl">
                        <FormControl isInvalid={!!errors.email || !!loginError}>
                            <FormControlLabel>
                                <FormControlLabelText>Correu electrònic</FormControlLabelText>
                            </FormControlLabel>
                            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                                <Input
                                    className={`bg-festa-baseClar border-festa-baseMig data-[focus=true]:web:ring-0
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
                        <FormControl isInvalid={!!errors.password || !!loginError}>
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
                            {errors.password &&
                                <FormControlError>
                                    <FormControlErrorText className="font-schibsted text-xs">
                                        {errors.password.message}
                                    </FormControlErrorText>
                                </FormControlError>}
                        </FormControl>
                        <AppButton
                            label="Iniciar sessió"
                            onPress={handleLogin}
                            bgColor={AppColors.Aqua}
                            textColor={AppColors.BaseObscur}
                            fontSize={15}
                            centered
                            shadow
                        />
                    </VStack>
                </Card>
                <Pressable className="mt-6">
                    <Text className="text-festa-baseMig text-sm mb-7">
                        No tens compte?{' '}
                        <Text className={`${isDark ? 'text-festa-verd' : 'text-festa-verdObscur'}`}>Registra't</Text>
                    </Text>
                </Pressable>
            </View>

            <View />

        </ScrollView>
    );
}