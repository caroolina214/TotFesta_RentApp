import { Button, ButtonText } from '@/src/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { Input, InputField, InputSlot, InputIcon } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { Card } from '@/src/components/ui/card';
import { useState } from 'react';
import { useColorScheme, ScrollView, Pressable, View } from 'react-native';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import DiscoBall from '@/src/components/custom/DiscoBall';
import { AppColors } from '../constants/colors';
import { useWindowDimensions } from 'react-native';

export default function LoginScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { width } = useWindowDimensions();
    const isWeb = width > 768;

    const handleLogin = () => {
        console.log('login', email, password);
    };

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: isWeb ? 'center' : 'space-between',
                padding: 15,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
            }}
            keyboardShouldPersistTaps="handled"
        >
            {/* Discoball - sempre dalt */}
            <DiscoBall size={isWeb ? 50 : 150} />

            {/* Bloc central - títol, card i registre */}
            <View style={{ alignItems: 'center', width: '100%' }}>
                <Text className="text-6xl md:text-5xl font-fuzzy-bold mt-2 text-festa-aqua">
                    TotFesta
                </Text>
                <Text className={`text-lg md:text-base mb-8 uppercase font-schibsted-italic text-center ${isDark ? 'text-festa-aquaClar' : 'text-festa-aquaObscur'}`}>
                    Lloga fàcil. Celebra gran.
                </Text>
                <Card className="w-full max-w-sm p-6 rounded-2xl bg-festa-verdClar">
                    <VStack space="2xl">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Correu electrònic</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    placeholder="exemple@correu.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="bg-festa-baseClar text-festa-baseObscur"
                                />
                            </Input>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Contrasenya</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    value={password}
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
                        <Button onPress={handleLogin} className="mt-2 bg-festa-aqua">
                            <ButtonText className="text-festa-baseObscur">Iniciar sessió</ButtonText>
                        </Button>
                    </VStack>
                </Card>
                <Pressable className="mt-6">
                    <Text className="text-festa-baseMig text-sm">
                        No tens compte?{' '}
                        <Text className="text-festa-verdObscur">Registra't</Text>
                    </Text>
                </Pressable>
            </View>

            {/* Espai buit per equilibrar el space-between en mòbil */}
            {!isWeb && <View />}

        </ScrollView>
    );
}