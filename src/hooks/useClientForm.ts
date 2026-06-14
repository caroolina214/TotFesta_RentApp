import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { clientSchema, ClientFormValues } from '@/src/schemas/client.schema';
import { clientes, direccionesCliente } from '@/src/types/types';

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

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: defaultFormValues,
    });

    const [loadedValues, setLoadedValues] = useState<ClientFormValues>(defaultFormValues);

    const [confirmDialog, setConfirmDialog] = useState<{
        visible: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ visible: false, title: '', message: '', onConfirm: () => { } });

    useEffect(() => {
        if (isEdit) {
            const client = clientes.find(c => c.id === Number(id));
            const dir = direccionesCliente.find(d => d.clienteId === Number(id));
            if (client) {
                const values: ClientFormValues = {
                    nombre: client.nombre,
                    nifCif: client.nifCif ?? '',
                    telefono: client.telefono ?? '',
                    email: client.email ?? '',
                    notas: client.notas ?? '',
                    activo: client.activo,
                    direccion: {
                        linea1: dir?.linea1 ?? '',
                        ciudad: dir?.ciudad ?? '',
                        codigoPostal: dir?.codigoPostal ?? '',
                        esPrincipal: dir?.esPrincipal ?? true,
                    },
                };
                setLoadedValues(values);
                reset(values);
            }
        }
    }, [id]);

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        setConfirmDialog({ visible: true, title, message, onConfirm });
    };

    const closeDialog = () => setConfirmDialog(prev => ({ ...prev, visible: false }));

    const handleSave = handleSubmit((data: ClientFormValues) => {
        confirmAction(
            isEdit ? 'Guardar canvis' : 'Crear client',
            isEdit ? 'Vols guardar els canvis realitzats?' : 'Vols crear aquest client?',
            () => {
                console.log('submit', data);
                // TODO: connectar amb Supabase a la tasca 4
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
        confirmDialog,
        closeDialog,
        handleSave,
        handleReset,
    };
}