import { AppButton, ConfirmDialog, RequiredLabel } from '@/src/components/custom';
import { Card } from '@/src/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '@/src/components/ui/form-control';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { Textarea, TextareaInput } from '@/src/components/ui/textarea';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { pedidoService } from '@/src/services/pedidoService';
import { clientService } from '@/src/services/clientService';
import { PedidoFormValues, pedidoSchema } from '@/src/schemas/pedido.schema';
import { useUserStore } from '@/src/stores/userStore';
import { EstadoPedido } from '@/src/types/Pedido';
import { getEstadoLabel } from '@/src/utils/pedidoUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, RotateCcw, Save } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const estats: EstadoPedido[] = ['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO'];

const defaultValues: PedidoFormValues = {
    clienteId: 0,
    fechaInicio: '',
    fechaFin: '',
    estado: 'PREPARADO',
    notas: '',
};

export default function OrderFormScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;
    const queryClient = useQueryClient();
    const { id: userId } = useUserStore();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PedidoFormValues>({
        resolver: zodResolver(pedidoSchema),
        defaultValues,
    });

    const [confirmDialog, setConfirmDialog] = useState<{ visible: boolean; title: string; message: string }>({
        visible: false, title: '', message: '',
    });
    const onConfirmRef = useRef<() => void>(() => { });

    const { data: clients = [] } = useQuery({
        queryKey: ['clientes'],
        queryFn: clientService.getAll,
    });

    const { data: pedidos = [] } = useQuery({
        queryKey: ['pedidos'],
        queryFn: pedidoService.getAll,
        enabled: isEdit,
    });

    useEffect(() => {
        if (isEdit && pedidos.length > 0) {
            const pedido = pedidos.find(p => p.id === Number(id));
            if (pedido) {
                reset({
                    clienteId: pedido.clienteId,
                    fechaInicio: pedido.fechaInicio,
                    fechaFin: pedido.fechaFin,
                    estado: pedido.estado,
                    notas: pedido.notas ?? '',
                });
            }
        }
    }, [pedidos, id]);

    const createMutation = useMutation({
        mutationFn: (data: PedidoFormValues) => pedidoService.create(data, userId!),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
    });

    const updateMutation = useMutation({
        mutationFn: (data: PedidoFormValues) => pedidoService.update(Number(id), data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
    });

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        onConfirmRef.current = onConfirm;
        setConfirmDialog({ visible: true, title, message });
    };

    const closeDialog = () => setConfirmDialog(prev => ({ ...prev, visible: false }));

    const handleSave = handleSubmit((data) => {
        confirmAction(
            isEdit ? 'Guardar canvis' : 'Crear pedido',
            isEdit ? 'Vols guardar els canvis?' : 'Vols crear aquest pedido?',
            async () => {
                if (isEdit) {
                    await updateMutation.mutateAsync(data);
                } else {
                    await createMutation.mutateAsync(data);
                }
                router.back();
            }
        );
    });

    const inputClass = `border-festa-baseMig data-[focus=true]:border-festa-morat data-[focus=true]:web:ring-0 ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: insets.top + 12,
                paddingBottom: 12,
                paddingHorizontal: 20,
                backgroundColor: isDark ? AppColors.BaseObscur : AppColors.BaseClar,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? AppColors.MoratObscur : AppColors.BaseMig,
            }}>
                <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ChevronLeft size={20} color={AppColors.Aqua} />
                    <Text className="text-festa-aqua font-schibsted">
                        {isEdit ? 'Pedido' : 'Pedidos'}
                    </Text>
                </Pressable>
                <AppButton
                    label="Guardar"
                    onPress={isDirty ? handleSave : () => { }}
                    icon={Save}
                    bgColor={isDirty ? AppColors.AquaClar : AppColors.BaseClar}
                    textColor={isDirty ? AppColors.AquaObscur : AppColors.BaseMig}
                    opacity={isDirty ? 1 : 0.4}
                    shadow={isDirty}
                />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                <VStack space="md">
                    <Text className="text-3xl font-fuzzy-bold text-festa-morat">
                        {isEdit ? 'Editar pedido' : 'Nou pedido'}
                    </Text>

                    <Card className={`p-4 rounded-2xl ${isDark ? 'bg-festa-aquaObscur' : 'bg-white'}`}>
                        <VStack space="md">
                            <Text className="text-xs font-schibsted text-festa-baseMig uppercase tracking-widest">
                                Dades del pedido
                            </Text>

                            {/* Client */}
                            <FormControl isInvalid={!!errors.clienteId}>
                                <FormControlLabel><RequiredLabel label="Client" /></FormControlLabel>
                                <Controller control={control} name="clienteId" render={({ field: { onChange, value } }) => (
                                    <VStack space="xs">
                                        {clients.map(client => (
                                            <AppButton
                                                key={client.id}
                                                label={client.nombre}
                                                onPress={() => onChange(client.id)}
                                                bgColor={value === client.id ? AppColors.MoratClar : isDark ? AppColors.MoratObscur : AppColors.BaseClar}
                                                textColor={value === client.id ? AppColors.MoratObscur : AppColors.BaseMig}
                                                outlined={value !== client.id}
                                                outlineColor={AppColors.BaseMig}
                                            />
                                        ))}
                                    </VStack>
                                )} />
                                {errors.clienteId && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.clienteId.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            {/* Data inici */}
                            <FormControl isInvalid={!!errors.fechaInicio}>
                                <FormControlLabel><RequiredLabel label="Data inici" /></FormControlLabel>
                                <Controller control={control} name="fechaInicio" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField
                                            placeholder="YYYY-MM-DD"
                                            value={value}
                                            onChangeText={onChange}
                                            style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}
                                        />
                                    </Input>
                                )} />
                                {errors.fechaInicio && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.fechaInicio.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            {/* Data fi */}
                            <FormControl isInvalid={!!errors.fechaFin}>
                                <FormControlLabel><RequiredLabel label="Data fi" /></FormControlLabel>
                                <Controller control={control} name="fechaFin" render={({ field: { onChange, value } }) => (
                                    <Input className={inputClass}>
                                        <InputField
                                            placeholder="YYYY-MM-DD"
                                            value={value}
                                            onChangeText={onChange}
                                            style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}
                                        />
                                    </Input>
                                )} />
                                {errors.fechaFin && <FormControlError><FormControlErrorText className="font-schibsted text-xs">{errors.fechaFin.message}</FormControlErrorText></FormControlError>}
                            </FormControl>

                            {/* Estat */}
                            <FormControl isInvalid={!!errors.estado}>
                                <FormControlLabel><RequiredLabel label="Estat" /></FormControlLabel>
                                <Controller control={control} name="estado" render={({ field: { onChange, value } }) => (
                                    <VStack space="xs">
                                        {estats.map(estat => (
                                            <AppButton
                                                key={estat}
                                                label={getEstadoLabel(estat)}
                                                onPress={() => onChange(estat)}
                                                bgColor={value === estat ? AppColors.AquaClar : isDark ? AppColors.MoratObscur : AppColors.BaseClar}
                                                textColor={value === estat ? AppColors.AquaObscur : AppColors.BaseMig}
                                                outlined={value !== estat}
                                                outlineColor={AppColors.BaseMig}
                                            />
                                        ))}
                                    </VStack>
                                )} />
                            </FormControl>

                            {/* Notes */}
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>Notes</FormControlLabelText>
                                </FormControlLabel>
                                <Controller control={control} name="notas" render={({ field: { onChange, value } }) => (
                                    <Textarea className={`border-festa-baseMig data-[focus=true]:border-festa-morat ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`} size="md">
                                        <TextareaInput
                                            placeholder="Notes sobre el pedido..."
                                            value={value}
                                            onChangeText={onChange}
                                            style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}
                                        />
                                    </Textarea>
                                )} />
                            </FormControl>
                        </VStack>
                    </Card>
                </VStack>
            </ScrollView>

            <ConfirmDialog
                visible={confirmDialog.visible}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={onConfirmRef.current}
                onClose={closeDialog}
            />
        </KeyboardAvoidingView>
    );
}