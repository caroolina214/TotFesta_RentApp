import {
    Cliente,
    DireccionCliente,
    clientes,
    direccionesCliente,
} from '@/src/types/types';

export const clientService = {

    getAll: (): Cliente[] => {
        return clientes;
    },

    getById: (id: number): Cliente | undefined => {
        return clientes.find(c => c.id === id);
    },

    getDireccionByClienteId: (clienteId: number): DireccionCliente | undefined => {
        return direccionesCliente.find(d => d.clienteId === clienteId);
    },

    create: (
        data: Omit<Cliente, 'id'>,
        direccion: Omit<DireccionCliente, 'id' | 'clienteId'>
    ): Cliente => {
        const newCliente: Cliente = {
            ...data,
            id: Math.max(...clientes.map(c => c.id)) + 1,
        };

        clientes.push(newCliente);

        const newDireccion: DireccionCliente = {
            ...direccion,
            id: Math.max(...direccionesCliente.map(d => d.id)) + 1,
            clienteId: newCliente.id,
        };

        direccionesCliente.push(newDireccion);

        return newCliente;
    },

    update: (
        id: number,
        data: Omit<Cliente, 'id'>,
        direccion: Omit<DireccionCliente, 'id' | 'clienteId'>
    ): Cliente | null => {
        const index = clientes.findIndex(c => c.id === id);

        if (index === -1) return null;

        clientes[index] = { ...clientes[index], ...data };

        const dirIndex = direccionesCliente.findIndex(d => d.clienteId === id);

        if (dirIndex !== -1) {
            direccionesCliente[dirIndex] = { ...direccionesCliente[dirIndex], ...direccion };
        } else {
            direccionesCliente.push({
                ...direccion,
                id: Math.max(...direccionesCliente.map(d => d.id)) + 1,
                clienteId: id,
            });
        }

        return clientes[index];
    },

    softDelete: (id: number): Cliente | null => {
        const index = clientes.findIndex(c => c.id === id);
        if (index === -1) return null;
        clientes[index] = { ...clientes[index], activo: false };
        return clientes[index];
    },

};