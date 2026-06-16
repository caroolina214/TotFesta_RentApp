import { AppButton, DiscoBall } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { authStore } from '@/src/store/authStore';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, useColorScheme, useWindowDimensions, View } from 'react-native';
import { AppColors } from '../constants/colors';

export default function LoginPage() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isTallScreen = height > 800;

    const handleLogin = () => {
        authStore.login();
        router.replace('/(protected)/(tabs)');
    };

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
            {/* Discoball */}
            <DiscoBall size={isWeb ? (isTallScreen ? 190 : 120) : 150} />

            {/* Bloc central - títol, card i registre */}
            <View style={{ alignItems: 'center', width: '100%', marginTop: isTallScreen ? 60 : 0 }}>
                <Text className="text-6xl md:text-5xl font-fuzzy-bold mt-2 text-festa-aqua">
                    TotFesta
                </Text>
                <Text className={`text-lg md:text-base mb-6 uppercase font-schibsted-italic text-center ${isDark ? 'text-festa-aquaClar' : 'text-festa-aquaObscur'}`}>
                    Lloga fàcil. Celebra gran.
                </Text>
                <Card
                    className="w-full max-w-xs lg:max-w-md p-6 rounded-2xl bg-festa-grocClar shadow-lg"
                    style={Platform.select({
                        android: {
                            elevation: 8,
                        },
                    })}
                >
                    <VStack space="2xl">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Correu electrònic</FormControlLabelText>
                            </FormControlLabel>
                            <Input
                                className="bg-festa-baseClar text-festa-baseObscur
                                        border-festa-baseMig
                                        data-[focus=true]:border-festa-aqua
                                        data-[focus=true]:hover:border-festa-aqua 
                                        data-[focus=true]:web:ring-0"
                            >
                                <InputField
                                    placeholder="exemple@correu.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </Input>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Contrasenya</FormControlLabelText>
                            </FormControlLabel>
                            <Input
                                className="bg-festa-baseClar text-festa-baseObscur
                                        border-festa-baseMig
                                        data-[focus=true]:border-festa-aqua
                                        data-[focus=true]:hover:border-festa-aqua
                                        data-[focus=true]:web:ring-0"
                            >
                                <InputField
                                    placeholder="********"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    autoCapitalize="none"
                                    onChangeText={setPassword}
                                />
                                <InputSlot
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="pr-3"
                                >
                                    <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
                                </InputSlot>
                            </Input>
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
                        <Text className="text-festa-verdObscur">Registra't</Text>
                    </Text>
                </Pressable>
            </View>

            <View />

        </ScrollView>
    );
}