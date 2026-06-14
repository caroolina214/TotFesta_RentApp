import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, View, useColorScheme, Pressable, useWindowDimensions } from 'react-native';
import { Controller } from 'react-hook-form';
import { Text } from '@/src/components/ui/text';
import { Card } from '@/src/components/ui/card';
import { VStack } from '@/src/components/ui/vstack';
import { HStack } from '@/src/components/ui/hstack';
import { Input, InputField } from '@/src/components/ui/input';
import { Textarea, TextareaInput } from '@/src/components/ui/textarea';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/src/components/ui/form-control';
import { AppColors } from '@/src/constants/colors';
import { ChevronLeft, Save, RotateCcw } from 'lucide-react-native';
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@/src/components/ui/alert-dialog';
import { Button, ButtonText } from '@/src/components/ui/button';
import { useClientForm } from '@/src/hooks/useClientForm';

export default function ClientFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { width } = useWindowDimensions();
    const isSmall = width < 640;

    const { control, errors, isDirty, isEdit, confirmDialog, closeDialog, handleSave, handleReset } = useClientForm(id);

    const inputClass = `border-festa-baseMig data-[focus=true]:border-festa-morat data-[focus=true]:web:ring-0 ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`;
    const textareaClass = `border-festa-baseMig data-[focus=true]:border-festa-morat ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`;

    const RequiredLabel = ({ label }: { label: string }) => (
        <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
            {label} <Text style={{ color: AppColors.Fucsia }}>*</Text>
        </FormControlLabelText>
    );

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}>
            {/* Capçalera sticky */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: isSmall ? 16 : 30,
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
                    <Pressable
                        onPress={handleReset}
                        style={{
                            flexDirection: 'row', alignItems: 'center', gap: 6,
                            backgroundColor: isDirty ? AppColors.GrocClar : AppColors.BaseClar,
                            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                            opacity: isDirty ? 1 : 0.4,
                        }}
                    >
                        <RotateCcw size={14} color={isDirty ? AppColors.GrocObscur : AppColors.BaseMig} />
                        <Text style={{ color: isDirty ? AppColors.GrocObscur : AppColors.BaseMig, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>Desfer</Text>
                    </Pressable>
                    <Pressable
                        onPress={isDirty ? handleSave : undefined}
                        style={{
                            flexDirection: 'row', alignItems: 'center', gap: 6,
                            backgroundColor: isDirty ? AppColors.AquaClar : AppColors.BaseClar,
                            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                            opacity: isDirty ? 1 : 0.4,
                        }}
                    >
                        <Save size={14} color={isDirty ? AppColors.AquaObscur : AppColors.BaseMig} />
                        <Text style={{ color: isDirty ? AppColors.AquaObscur : AppColors.BaseMig, fontFamily: 'SchibstedGrotesk', fontSize: 13 }}>Guardar</Text>
                    </Pressable>
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

                    <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                        <VStack space="md">
                            <Text className="text-xs font-schibsted text-festa-baseMig uppercase" style={{ letterSpacing: 1 }}>
                                Dades bàsiques
                            </Text>
                            <FormControl isInvalid={!!errors.nombre}>
                                <FormControlLabel><RequiredLabel label="Nom" /></FormControlLabel>
                                <Controller control={control} name="nombre" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}><InputField placeholder="Nom del client" value={value} onChangeText={onChange} /></Input>
                                )} />
                                {errors.nombre && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.nombre.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.nifCif}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>NIF/CIF</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="nifCif" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}><InputField placeholder="12345678A" value={value} onChangeText={onChange} autoCapitalize="characters" /></Input>
                                )} />
                                {errors.nifCif && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.nifCif.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.telefono}>
                                <FormControlLabel><RequiredLabel label="Telèfon" /></FormControlLabel>
                                <Controller control={control} name="telefono" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}><InputField placeholder="612000111" value={value} onChangeText={onChange} keyboardType="phone-pad" /></Input>
                                )} />
                                {errors.telefono && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.telefono.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.email}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>Correu electrònic</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}><InputField placeholder="client@exemple.com" value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" /></Input>
                                )} />
                                {errors.email && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.email.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <FormControl isInvalid={!!errors.notas}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>Notes</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="notas" render={({ field: { onChange, value } }) => (
                                    <Textarea className={textareaClass} size="md">
                                        <TextareaInput placeholder="Notes sobre el client..." value={value} onChangeText={onChange} />
                                    </Textarea>
                                )} />
                                {errors.notas && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.notas.message}</FormControlErrorText></FormControlError>}
                            </FormControl>
                        </VStack>
                    </Card>

                    <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                        <VStack space="md">
                            <Text className="text-xs font-schibsted text-festa-baseMig uppercase" style={{ letterSpacing: 1 }}>
                                Adreça principal
                            </Text>
                            <FormControl isInvalid={!!errors.direccion?.linea1}>
                                <FormControlLabel><RequiredLabel label="Adreça" /></FormControlLabel>
                                <Controller control={control} name="direccion.linea1" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}><InputField placeholder="Carrer Major 12" value={value} onChangeText={onChange} /></Input>
                                )} />
                                {errors.direccion?.linea1 && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.direccion.linea1.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            <HStack space="md">
                                <View style={{ flex: 2 }}>
                                    <FormControl isInvalid={!!errors.direccion?.ciudad}>
                                        <FormControlLabel><RequiredLabel label="Ciutat" /></FormControlLabel>
                                        <Controller control={control} name="direccion.ciudad" render={({ field: { onChange, value } }) => (
                                            <Input className={inputClass}><InputField placeholder="València" value={value} onChangeText={onChange} /></Input>
                                        )} />
                                        {errors.direccion?.ciudad && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.direccion.ciudad.message}</FormControlErrorText></FormControlError>}
                                    </FormControl>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FormControl isInvalid={!!errors.direccion?.codigoPostal}>
                                        <FormControlLabel><RequiredLabel label="CP" /></FormControlLabel>
                                        <Controller control={control} name="direccion.codigoPostal" render={({ field: { onChange, value } }) => (
                                            <Input className={inputClass}><InputField placeholder="46001" value={value} onChangeText={onChange} keyboardType="numeric" maxLength={5} /></Input>
                                        )} />
                                        {errors.direccion?.codigoPostal && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.direccion.codigoPostal.message}</FormControlErrorText></FormControlError>}
                                    </FormControl>
                                </View>
                            </HStack>
                        </VStack>
                    </Card>
                </VStack>
            </ScrollView>

            <AlertDialog isOpen={confirmDialog.visible} onClose={closeDialog}>
                <AlertDialogBackdrop />
                <AlertDialogContent className={isDark ? 'bg-festa-moratObscur' : 'bg-white'}>
                    <AlertDialogHeader>
                        <Text className="text-xl font-fuzzy-bold text-festa-morat">{confirmDialog.title}</Text>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="font-schibsted pb-5" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                            {confirmDialog.message}
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button variant="outline" onPress={closeDialog} className="border-festa-baseMig">
                            <ButtonText className="font-schibsted text-festa-baseMig">Cancel·lar</ButtonText>
                        </Button>
                        <Button onPress={() => { confirmDialog.onConfirm(); closeDialog(); }} className="bg-festa-aqua">
                            <ButtonText className="font-schibsted text-festa-baseObscur">Confirmar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </View>
    );
}