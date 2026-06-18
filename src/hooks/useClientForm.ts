import { clientSchema, ClientFormValues } from '@/src/schemas/client.schema';
import { clientService } from '@/src/services/clientService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export const defaultFormValues: ClientFormValues = {
    nombre: '',
    nifCif: '',
    telefono: '',
    email: '',
    notas: '',
    activo: true,
    direccion: { linea1: '', ciudad: '', codigoPostal: '', esPrincipal: true },
};

export function useClientForm(id?: string) {
    const isEdit = !!id;
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: defaultFormValues,
    });

    const { data: clienteData } = useQuery({
        queryKey: ['clientes', id],
        queryFn: () => clientService.getById(Number(id)),
        enabled: isEdit,
    });

    const createMutation = useMutation({
        mutationFn: ({ cliente, direccion }: any) => clientService.create(cliente, direccion),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, cliente, direccion }: any) => clientService.update(id, cliente, direccion),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
    });

    const [loadedValues, setLoadedValues] = useState<ClientFormValues>(defaultFormValues);
    const [confirmDialog, setConfirmDialog] = useState<{
        visible: boolean;
        title: string;
        message: string;
    }>({ visible: false, title: '', message: '' });
    const onConfirmRef = useRef<() => void>(() => { });

    useEffect(() => {
        if (isEdit && clienteData) {
            const values: ClientFormValues = {
                nombre: clienteData.nombre,
                nifCif: clienteData.nifCif ?? '',
                telefono: clienteData.telefono ?? '',
                email: clienteData.email ?? '',
                notas: clienteData.notas ?? '',
                activo: clienteData.activo,
                direccion: {
                    linea1: clienteData.direccion.linea1 ?? '',
                    ciudad: clienteData.direccion.ciudad ?? '',
                    codigoPostal: clienteData.direccion.codigoPostal ?? '',
                    esPrincipal: clienteData.direccion.esPrincipal ?? true,
                },
            };
            setLoadedValues(values);
            reset(values);
        }
    }, [clienteData, id]);

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        onConfirmRef.current = onConfirm;
        setConfirmDialog({ visible: true, title, message });
    };

    const closeDialog = () => setConfirmDialog(prev => ({ ...prev, visible: false }));

    const handleSave = handleSubmit((data: ClientFormValues) => {
        confirmAction(
            isEdit ? 'Guardar canvis' : 'Crear client',
            isEdit ? 'Vols guardar els canvis realitzats?' : 'Vols crear aquest client?',
            async () => {
                if (isEdit) {
                    await updateMutation.mutateAsync({
                        id: Number(id),
                        cliente: {
                            nombre: data.nombre,
                            nifCif: data.nifCif,
                            telefono: data.telefono,
                            email: data.email,
                            notas: data.notas,
                            activo: data.activo,
                        },
                        direccion: data.direccion,
                    });
                } else {
                    await createMutation.mutateAsync({
                        cliente: {
                            nombre: data.nombre,
                            nifCif: data.nifCif,
                            telefono: data.telefono,
                            email: data.email,
                            notas: data.notas,
                            activo: data.activo,
                        },
                        direccion: data.direccion,
                    });
                }
                router.back();
            }
        );
    });

    const handleReset = () => {
        confirmAction(
            'Desfer canvis',
            'Vols desfer tots els canvis realitzats?',
            () => reset(loadedValues)
        );
    };

    return {
        control,
        errors,
        isDirty,
        isEdit,
        isLoading: createMutation.isPending || updateMutation.isPending,
        confirmDialog: { ...confirmDialog, onConfirm: onConfirmRef.current },
        closeDialog,
        handleSave,
        handleReset,
    };
}