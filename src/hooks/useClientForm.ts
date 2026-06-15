import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { clientSchema, ClientFormValues } from '@/src/schemas/client.schema';
import { clientes, direccionesCliente } from '@/src/types/types';
import { clientService } from '../services/clientService';

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
    }>({ visible: false, title: '', message: '' });
    const onConfirmRef = useRef<() => void>(() => { });

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
        onConfirmRef.current = onConfirm;
        setConfirmDialog({ visible: true, title, message });
    };
    const closeDialog = () => setConfirmDialog(prev => ({ ...prev, visible: false }));

    const handleSave = handleSubmit((data: ClientFormValues) => {
        confirmAction(
            isEdit ? 'Guardar canvis' : 'Crear client',
            isEdit ? 'Vols guardar els canvis realitzats?' : 'Vols crear aquest client?',
            () => {
                if (isEdit) {
                    clientService.update(Number(id), {
                        nombre: data.nombre,
                        nifCif: data.nifCif,
                        telefono: data.telefono,
                        email: data.email,
                        notas: data.notas,
                        activo: data.activo,
                    }, data.direccion);
                } else {
                    clientService.create({
                        nombre: data.nombre,
                        nifCif: data.nifCif,
                        telefono: data.telefono,
                        email: data.email,
                        notas: data.notas,
                        activo: data.activo,
                    }, data.direccion);
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
        confirmDialog: { ...confirmDialog, onConfirm: onConfirmRef.current },
        closeDialog,
        handleSave,
        handleReset,
    };
}