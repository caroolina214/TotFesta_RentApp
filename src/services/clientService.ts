import { supabase } from '@/src/config/supabaseClient';
import { Client, DireccioClient } from '@/src/types/Client';

type ClienteRow = {
    id_cliente: number;
    nombre: string;
    nif_cif: string | null;
    telefono: string | null;
    email: string | null;
    notas: string | null;
    activo: boolean;
    fecha_alta?: string;
    direcciones_cliente?: DireccionClienteRow[];
    pedidos?: { count: number }[];
};

type DireccionClienteRow = {
    id_direccion: number;
    id_cliente: number;
    alias: string | null;
    linea1: string;
    linea2: string | null;
    ciudad: string | null;
    provincia: string | null;
    codigo_postal: string | null;
    pais: string | null;
    latitud: number | null;
    longitud: number | null;
    es_principal: boolean;
};

const mapDireccion = (row?: DireccionClienteRow | null): DireccioClient => ({
    id: row?.id_direccion ?? 0,
    alias: row?.alias ?? undefined,
    linea1: row?.linea1 ?? '',
    linea2: row?.linea2 ?? undefined,
    ciudad: row?.ciudad ?? undefined,
    provincia: row?.provincia ?? undefined,
    codigoPostal: row?.codigo_postal ?? undefined,
    pais: row?.pais ?? undefined,
    latitud: row?.latitud ?? undefined,
    longitud: row?.longitud ?? undefined,
    esPrincipal: row?.es_principal ?? true,
});

const mapCliente = (row: ClienteRow): Client => {
    const direccionRow =
        row.direcciones_cliente?.find(d => d.es_principal) ??
        row.direcciones_cliente?.[0];
    return {
        id: row.id_cliente,
        nombre: row.nombre,
        nifCif: row.nif_cif ?? undefined,
        telefono: row.telefono ?? undefined,
        email: row.email ?? undefined,
        notas: row.notas ?? undefined,
        activo: row.activo,
        direccion: mapDireccion(direccionRow),
        pedidosCount: row.pedidos?.[0]?.count ?? 0,
    };
};

export const clientService = {

    getAll: async (): Promise<Client[]> => {
        const { data, error } = await supabase
            .from('clientes')
            .select('id_cliente, nombre, nif_cif, telefono, email, notas, activo, pedidos(count)')
            .order('nombre');
        if (error || !data) throw new Error('No s\'han pogut carregar els clients.');
        return data.map(mapCliente);
    },

    getById: async (id: number): Promise<Client | undefined> => {
        const { data, error } = await supabase
            .from('clientes')
            .select('id_cliente, nombre, nif_cif, telefono, email, notas, activo, direcciones_cliente(*)')
            .eq('id_cliente', id)
            .maybeSingle();
        if (error) throw new Error('No s\'ha pogut carregar el client.');
        return data ? mapCliente(data) : undefined;
    },

    getDireccionByClienteId: async (clienteId: number): Promise<DireccioClient | undefined> => {
        const { data, error } = await supabase
            .from('direcciones_cliente')
            .select('*')
            .eq('id_cliente', clienteId)
            .eq('es_principal', true)
            .maybeSingle();
        if (error) return undefined;
        return data ? mapDireccion(data) : undefined;
    },

    create: async (
        cliente: Omit<Client, 'id' | 'direccion'>,
        direccion: Omit<DireccioClient, 'id'>
    ): Promise<Client> => {
        const { data, error } = await supabase
            .from('clientes')
            .insert({
                nombre: cliente.nombre,
                nif_cif: cliente.nifCif ?? null,
                telefono: cliente.telefono ?? null,
                email: cliente.email ?? null,
                notas: cliente.notas ?? null,
                activo: cliente.activo ?? true,
            })
            .select('id_cliente, nombre, nif_cif, telefono, email, notas, activo')
            .single();
        if (error || !data) throw new Error('No s\'ha pogut crear el client.');

        await supabase
            .from('direcciones_cliente')
            .insert({
                id_cliente: data.id_cliente,
                alias: direccion.alias ?? null,
                linea1: direccion.linea1,
                linea2: direccion.linea2 ?? null,
                ciudad: direccion.ciudad ?? null,
                provincia: direccion.provincia ?? null,
                codigo_postal: direccion.codigoPostal ?? null,
                pais: direccion.pais ?? null,
                es_principal: direccion.esPrincipal ?? true,
            });

        return mapCliente(data);
    },

    update: async (
        id: number,
        cliente: Omit<Client, 'id' | 'direccion'>,
        direccion: Omit<DireccioClient, 'id'>
    ): Promise<Client> => {
        const { data, error } = await supabase
            .from('clientes')
            .update({
                nombre: cliente.nombre,
                nif_cif: cliente.nifCif ?? null,
                telefono: cliente.telefono ?? null,
                email: cliente.email ?? null,
                notas: cliente.notas ?? null,
                activo: cliente.activo,
            })
            .eq('id_cliente', id)
            .select('id_cliente, nombre, nif_cif, telefono, email, notas, activo')
            .single();
        if (error || !data) throw new Error('No s\'ha pogut actualitzar el client.');

        await supabase
            .from('direcciones_cliente')
            .update({
                alias: direccion.alias ?? null,
                linea1: direccion.linea1,
                linea2: direccion.linea2 ?? null,
                ciudad: direccion.ciudad ?? null,
                provincia: direccion.provincia ?? null,
                codigo_postal: direccion.codigoPostal ?? null,
                pais: direccion.pais ?? null,
                es_principal: direccion.esPrincipal ?? true,
            })
            .eq('id_cliente', id)
            .eq('es_principal', true);

        return mapCliente(data);
    },

    softDelete: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('clientes')
            .update({ activo: false })
            .eq('id_cliente', id);
        if (error) throw new Error('No s\'ha pogut desactivar el client.');
    },
};