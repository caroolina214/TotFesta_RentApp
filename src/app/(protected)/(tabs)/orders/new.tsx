import { AppButton, ClientSelector, ConfirmDialog, ProducteSelector, RequiredLabel } from '@/src/components/custom';
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
import { useFieldArray } from 'react-hook-form';
import { producteService } from '@/src/services';
import { Plus } from 'lucide-react-native';


const estats: EstadoPedido[] = ['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO'];

const defaultValues: PedidoFormValues = {
    clienteId: 0,
    fechaInicio: '',
    fechaFin: '',
    estado: 'PREPARADO',
    notas: '',
    lineas: []
};

export default function OrderFormScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;
    const queryClient = useQueryClient();
    const { id: userId, role, clienteId } = useUserStore();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PedidoFormValues>({
        resolver: zodResolver(pedidoSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'lineas',
    });

    const [confirmDialog, setConfirmDialog] = useState<{
        visible: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    // ← eliminat onConfirmRef, ja no cal

    const { data: clients = [] } = useQuery({
        queryKey: ['clientes'],
        queryFn: clientService.getAll,
    });

    const { data: productos = [] } = useQuery({
        queryKey: ['productos'],
        queryFn: producteService.getAll,
    });

    const { data: pedido } = useQuery({
        queryKey: ['pedido', id],
        queryFn: () => pedidoService.getById(Number(id)),
        enabled: isEdit,
    });

    useEffect(() => {
        if (pedido) {
            reset({
                clienteId: pedido.clienteId,
                fechaInicio: pedido.fechaInicio,
                fechaFin: pedido.fechaFin,
                estado: pedido.estado,
                notas: pedido.notas ?? '',
                lineas: pedido.lineas.map(l => ({
                    productoId: l.productoId,
                    cantidad: l.cantidadTotal,
                })),
            });
        }
    }, [pedido]);

    useEffect(() => {
        if (!isEdit && role === 'CLIENT') {
            reset(prev => ({
                ...prev,
                clienteId: clienteId!,
            }));
        }
    }, [role, clienteId, isEdit]);

    const createMutation = useMutation({
        mutationFn: (data: PedidoFormValues) => pedidoService.create(data, userId!),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
    });

    const updateMutation = useMutation({
        mutationFn: (data: PedidoFormValues) => pedidoService.update(Number(id), data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
    });

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        setConfirmDialog({ visible: true, title, message, onConfirm });
    };

    const closeDialog = () =>
        setConfirmDialog(prev => ({ ...prev, visible: false, onConfirm: () => { } }));

    const handleSave = handleSubmit((data) => {
        confirmAction(
            isEdit ? 'Guardar canvis' : 'Crear pedido',
            isEdit ? 'Vols guardar els canvis?' : 'Vols crear aquest pedido?',
            async () => {
                try {
                    if (isEdit) {
                        await updateMutation.mutateAsync(data);
                    } else {
                        await createMutation.mutateAsync(data);
                    }
                    router.back();
                } catch (e) {
                    closeDialog();
                    // pots afegir aquí un toast o alert d'error
                }
            }
        );
    });

    const [filteredClients, setFilteredClients] = useState(clients);
    useEffect(() => {
        setFilteredClients(clients);
    }, [clients]);


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

                            {/* Client — només ADMIN/WORKER */}
                            {role !== 'CLIENT' ? (
                                <Controller
                                    control={control}
                                    name="clienteId"
                                    render={({ field: { onChange, value } }) => (
                                        <ClientSelector
                                            clients={clients}
                                            value={value}
                                            onChange={onChange}
                                            inputClass={inputClass}
                                        />
                                    )}
                                />
                            ) : (
                                <Text className="font-schibsted text-festa-baseMig">
                                    Client: {clients.find(c => c.id === clienteId)?.nombre}
                                </Text>
                            )}


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

                            {/* Estat — només ADMIN i WORKER */}
                            {role !== 'CLIENT' && (
                                <FormControl isInvalid={!!errors.estado}>
                                    <FormControlLabel><RequiredLabel label="Estat" /></FormControlLabel>
                                    <Controller
                                        control={control}
                                        name="estado"
                                        render={({ field: { onChange, value } }) => (
                                            <VStack space="xs">
                                                {estats.map(estat => (
                                                    <AppButton
                                                        key={estat}
                                                        label={getEstadoLabel(estat)}
                                                        onPress={() => onChange(estat)}
                                                        bgColor={value === estat ? AppColors.AquaClar : isDark ? AppColors.MoratObscur : AppColors.BaseClar}
                                                        textColor={value === estat ? AppColors.AquaObscur : AppColors.BaseMig}
                                                        outlined={value !== estat}
                                                        shadow={value === estat}
                                                        outlineColor={AppColors.BaseMig}
                                                    />
                                                ))}
                                            </VStack>
                                        )}
                                    />
                                </FormControl>
                            )}


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

                            {/* Línies de producte */}
                            <FormControl isInvalid={!!errors.lineas}>
                                <FormControlLabel>
                                    <RequiredLabel label="Línies de producte" />
                                </FormControlLabel>

                                <VStack space="md">
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className={`p-3 rounded-xl ${isDark ? 'bg-festa-moratObscur' : 'bg-festa-baseClar'}`}>
                                            <VStack space="sm">

                                                {/* Producte */}
                                                <Controller
                                                    control={control}
                                                    name={`lineas.${index}.productoId`}
                                                    render={({ field: { onChange, value } }) => (
                                                        <ProducteSelector
                                                            productos={productos}
                                                            value={value}
                                                            onChange={onChange}
                                                            inputClass={inputClass}
                                                            usedIds={fields.map((_, i) => 0)}
                                                        />
                                                    )}
                                                />

                                                <View className="flex flex-col md:flex-row w-full gap-2 items-end md:items-start">

                                                    {/* Quantitat */}
                                                    <FormControl className='flex-grow' isInvalid={!!errors.lineas?.[index]?.cantidad}>
                                                        <FormControlLabel>
                                                            <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                                                Quantitat
                                                            </FormControlLabelText>
                                                        </FormControlLabel>

                                                        <Controller
                                                            control={control}
                                                            name={`lineas.${index}.cantidad`}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Input className={inputClass}>
                                                                    <InputField
                                                                        placeholder="Quantitat"
                                                                        keyboardType="numeric"
                                                                        value={String(value ?? '')}
                                                                        onChangeText={t => onChange(Number(t))}
                                                                    />
                                                                </Input>
                                                            )}
                                                        />

                                                        {errors.lineas?.[index]?.cantidad && (
                                                            <FormControlError>
                                                                <FormControlErrorText className="font-schibsted text-xs">
                                                                    {errors.lineas[index].cantidad?.message}
                                                                </FormControlErrorText>
                                                            </FormControlError>
                                                        )}
                                                    </FormControl>

                                                    <View className='h-8 self-end mb-2 '>
                                                        <AppButton
                                                            label="Eliminar línia"
                                                            onPress={() => remove(index)}
                                                            bgColor={AppColors.FucsiaClar}
                                                            textColor={AppColors.Fucsia}
                                                            outlineColor={AppColors.Fucsia}
                                                            outlined
                                                        />
                                                    </View>
                                                </View>
                                            </VStack>
                                        </Card>
                                    ))}

                                    <AppButton
                                        label="Afegir línia"
                                        onPress={() => append({ productoId: 0, cantidad: 1, diasAlquiler: 1 })}
                                        bgColor={AppColors.VerdClar}
                                        textColor={AppColors.VerdObscur}
                                        shadow
                                        icon={Plus}
                                    />
                                </VStack>

                                {errors.lineas && (
                                    <FormControlError>
                                        <FormControlErrorText className="font-schibsted text-xs">
                                            {errors.lineas.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

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