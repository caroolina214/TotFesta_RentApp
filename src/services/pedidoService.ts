import { supabase } from '@/src/config/supabaseClient';
import { PedidoConDetalle, EstadoPedido } from '@/src/types/Pedido';
import { PedidoFormValues } from '@/src/schemas/pedido.schema';

type PedidoRow = {
    id_pedido: number;
    codigo: string;
    id_cliente: number;
    id_direccion_entrega: number | null;
    id_direccion_recogida: number | null;
    fecha_inicio: string;
    fecha_fin: string;
    estado: EstadoPedido;
    creado_por: number;
    notas: string | null;
    clientes: {
        id_cliente: number;
        nombre: string;
    } | {
        id_cliente: number;
        nombre: string;
    }[];
    lineas_pedido: {
        id_linea_pedido: number;
        cantidad_total: number;
        importe_linea: number;
    }[];
};

const mapPedido = (row: PedidoRow): PedidoConDetalle => ({
    id: row.id_pedido,
    codigo: row.codigo,
    clienteId: row.id_cliente,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    estado: row.estado,
    creadoPor: row.creado_por,
    notas: row.notas ?? undefined,
    cliente: {
        id: Array.isArray(row.clientes) ? row.clientes[0].id_cliente : row.clientes.id_cliente,
        nombre: Array.isArray(row.clientes) ? row.clientes[0].nombre : row.clientes.nombre,
        activo: true,
        direccion: { id: 0, linea1: '', esPrincipal: true },
    },
    lineas: row.lineas_pedido.map(l => ({
        id: l.id_linea_pedido,
        pedidoId: row.id_pedido,
        productoId: 0,
        precioDia: 0,
        diasAlquiler: 0,
        cantidadTotal: l.cantidad_total,
        importeLinea: l.importe_linea,
        producto: { id: 0, nombre: '', precioDia: 0 },
    })),
    totalUnidades: row.lineas_pedido.reduce((sum, l) => sum + l.cantidad_total, 0),
    totalImporte: row.lineas_pedido.reduce((sum, l) => sum + l.importe_linea, 0),
});

export const pedidoService = {

    getActivos: async (): Promise<PedidoConDetalle[]> => {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                id_pedido, codigo, id_cliente, id_direccion_entrega, id_direccion_recogida,
                fecha_inicio, fecha_fin, estado, creado_por, notas,
                clientes(id_cliente, nombre),
                lineas_pedido(id_linea_pedido, cantidad_total, importe_linea)
            `)
            .lte('fecha_inicio', today)
            .gte('fecha_fin', today)
            .neq('estado', 'FINALIZADO');
        if (error || !data) throw new Error('No s\'han pogut carregar els pedidos actius.');
        return data.map(mapPedido);
    },

    getAll: async (): Promise<PedidoConDetalle[]> => {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                id_pedido, codigo, id_cliente, id_direccion_entrega, id_direccion_recogida,
                fecha_inicio, fecha_fin, estado, creado_por, notas,
                clientes(id_cliente, nombre),
                lineas_pedido(id_linea_pedido, cantidad_total, importe_linea)
            `)
            .order('fecha_inicio', { ascending: false });
        if (error || !data) throw new Error('No s\'han pogut carregar els pedidos.');
        return data.map(mapPedido);
    },

    getByClienteId: async (clienteId: number): Promise<PedidoConDetalle[]> => {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
            id_pedido, codigo, id_cliente, id_direccion_entrega, id_direccion_recogida,
            fecha_inicio, fecha_fin, estado, creado_por, notas,
            clientes(id_cliente, nombre),
            lineas_pedido(id_linea_pedido, cantidad_total, importe_linea)
        `)
            .eq('id_cliente', clienteId)
            .order('fecha_inicio', { ascending: false });
        if (error || !data) throw new Error('No s\'han pogut carregar els pedidos del client.');
        return data.map(mapPedido);
    },

    create: async (
        pedido: PedidoFormValues,
        creadoPor: number
    ): Promise<void> => {
        const codigo = `P-${Date.now()}`;
        const { error } = await supabase
            .from('pedidos')
            .insert({
                codigo,
                id_cliente: pedido.clienteId,
                fecha_inicio: pedido.fechaInicio,
                fecha_fin: pedido.fechaFin,
                estado: pedido.estado,
                creado_por: creadoPor,
                notas: pedido.notas ?? null,
            });
        if (error) throw new Error('No s\'ha pogut crear el pedido.');
    },

    update: async (
        id: number,
        pedido: PedidoFormValues
    ): Promise<void> => {
        const { error } = await supabase
            .from('pedidos')
            .update({
                id_cliente: pedido.clienteId,
                fecha_inicio: pedido.fechaInicio,
                fecha_fin: pedido.fechaFin,
                estado: pedido.estado,
                notas: pedido.notas ?? null,
            })
            .eq('id_pedido', id);
        if (error) throw new Error('No s\'ha pogut actualitzar el pedido.');
    },

    updateEstado: async (
        id: number,
        estado: EstadoPedido
    ): Promise<void> => {
        const { error } = await supabase
            .from('pedidos')
            .update({ estado })
            .eq('id_pedido', id);
        if (error) throw new Error('No s\'ha pogut actualitzar l\'estat del pedido.');
    },
};