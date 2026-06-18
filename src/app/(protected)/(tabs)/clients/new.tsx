import { AppButton, ConfirmDialog, RequiredLabel } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { HStack } from '@/src/components/ui/hstack';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { Textarea, TextareaInput } from '@/src/components/ui/textarea';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useClientForm } from '@/src/hooks';
import { useThemeContext } from '@/src/providers/ThemeProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, RotateCcw, Save } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ClientFormScreen() {
    const { isDark } = useThemeContext();
    const { width } = useWindowDimensions();
    const isSmall = width < 640;
    const insets = useSafeAreaInsets();

    const { id } = useLocalSearchParams<{ id?: string }>();
    const { control, errors, isDirty, isEdit, confirmDialog, closeDialog, handleSave, handleReset } = useClientForm(id);

    const inputClass = `border-festa-baseMig data-[focus=true]:border-festa-morat data-[focus=true]:web:ring-0 ${isDark ? 'bg-festa-baseClar' : 'bg-white'}`;
    const textareaClass = `border-festa-baseMig data-[focus=true]:border-festa-morat ${isDark ? 'bg-festa-baseClar' : 'bg-white'}`;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Capçalera sticky */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: insets.top + 12,
                paddingBottom: 12,
                paddingHorizontal: isSmall ? 10 : 30,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? AppColors.MoratObscur : AppColors.BaseMig,
            }}>
                <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ChevronLeft size={20} color={AppColors.Aqua} />
                    <Text className="text-festa-aqua font-schibsted">
                        {isEdit ? 'Client' : 'Clients'}
                    </Text>
                </Pressable>
                <HStack space="sm">
                    <AppButton
                        label="Desfer"
                        onPress={handleReset}
                        icon={RotateCcw}
                        bgColor={isDirty ? AppColors.GrocClar : AppColors.BaseClar}
                        textColor={isDirty ? AppColors.GrocObscur : AppColors.BaseMig}
                        opacity={isDirty ? 1 : 0.4}
                        shadow={isDirty}
                    />
                    <AppButton
                        label="Guardar"
                        onPress={isDirty ? handleSave : () => { }}
                        icon={Save}
                        bgColor={isDirty ? AppColors.AquaClar : AppColors.BaseClar}
                        textColor={isDirty ? AppColors.AquaObscur : AppColors.BaseMig}
                        opacity={isDirty ? 1 : 0.4}
                        shadow={isDirty}
                    />
                </HStack>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: isSmall ? 16 : 30 }}
                keyboardShouldPersistTaps="handled"
            >
                <VStack space="md">
                    <Text className="text-3xl font-fuzzy-bold text-festa-morat">
                        {isEdit ? 'Editar client' : 'Nou client'}
                    </Text>

                    <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-aquaObscur' : 'bg-white'}`}>
                        <VStack space="md">
                            <Text className="text-xs font-schibsted text-festa-baseMig uppercase tracking-widest">
                                Dades bàsiques
                            </Text>
                            <FormControl isInvalid={!!errors.nombre}>
                                <FormControlLabel><RequiredLabel label="Nom" /></FormControlLabel>
                                <Controller control={control} name="nombre" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField placeholder="Nom del client" value={value} onChangeText={onChange}
                                            className='text-festa-baseObscur' />
                                    </Input>
                                )} />
                                {errors.nombre && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.nombre.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.nifCif}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>NIF/CIF</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="nifCif" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField placeholder="12345678A" value={value} onChangeText={onChange} autoCapitalize="characters"
                                            className='text-festa-baseObscur' />
                                    </Input>
                                )} />
                                {errors.nifCif && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.nifCif.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.telefono}>
                                <FormControlLabel><RequiredLabel label="Telèfon" /></FormControlLabel>
                                <Controller control={control} name="telefono" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField placeholder="612000111" value={value} onChangeText={onChange} keyboardType="phone-pad"
                                            className='text-festa-baseObscur' />
                                    </Input>
                                )} />
                                {errors.telefono && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.telefono.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.email}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>Correu electrònic</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField placeholder="client@exemple.com" value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none"
                                            className='text-festa-baseObscur' />
                                    </Input>
                                )} />
                                {errors.email && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.email.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.notas}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>Notes</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="notas" render={({ field: { onChange, value } }) => (
                                    <Textarea className={textareaClass} size="md">
                                        <TextareaInput placeholder="Notes sobre el client..." value={value} onChangeText={onChange}
                                            style={{ color: AppColors.BaseObscur }} />
                                    </Textarea>
                                )} />
                                {errors.notas && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.notas.message}</FormControlErrorText></FormControlError>}
                            </FormControl>
                        </VStack>
                    </Card>

                    <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-aquaObscur' : 'bg-white'}`}>
                        <VStack space="md">
                            <Text className="text-xs font-schibsted text-festa-baseMig uppercase tracking-widest">
                                Adreça principal
                            </Text>
                            <FormControl isInvalid={!!errors.direccion?.linea1}>
                                <FormControlLabel><RequiredLabel label="Adreça" /></FormControlLabel>
                                <Controller control={control} name="direccion.linea1" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField placeholder="Carrer Major 12" value={value} onChangeText={onChange}
                                            className='text-festa-baseObscur' />
                                    </Input>
                                )} />
                                {errors.direccion?.linea1 && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.direccion.linea1.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <HStack space="md">
                                <View style={{ flex: 2 }}>
                                    <FormControl isInvalid={!!errors.direccion?.ciudad}>
                                        <FormControlLabel><RequiredLabel label="Ciutat" /></FormControlLabel>
                                        <Controller control={control} name="direccion.ciudad" render={({ field: { onChange, value } }) => (
                                            <Input className={inputClass}>
                                                <InputField placeholder="València" value={value} onChangeText={onChange}
                                                    className='text-festa-baseObscur' />
                                            </Input>
                                        )} />
                                        {errors.direccion?.ciudad && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.direccion.ciudad.message}</FormControlErrorText></FormControlError>}
                                    </FormControl>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FormControl isInvalid={!!errors.direccion?.codigoPostal}>
                                        <FormControlLabel><RequiredLabel label="CP" /></FormControlLabel>
                                        <Controller control={control} name="direccion.codigoPostal" render={({ field: { onChange, value } }) => (
                                            <Input className={inputClass}>
                                                <InputField placeholder="46001" value={value} onChangeText={onChange} keyboardType="numeric" maxLength={5}
                                                    className='text-festa-baseObscur' />
                                            </Input>
                                        )} />
                                        {errors.direccion?.codigoPostal && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.direccion.codigoPostal.message}</FormControlErrorText></FormControlError>}
                                    </FormControl>
                                </View>
                            </HStack>
                        </VStack>
                    </Card>
                </VStack>
            </ScrollView>


            <ConfirmDialog
                visible={confirmDialog.visible}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onClose={closeDialog}
            />
        </KeyboardAvoidingView>
    );
}