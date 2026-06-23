import { supabase } from '@/src/config/supabaseClient';
import { PedidoConDetalle, EstadoPedido } from '@/src/types/Pedido';
import { PedidoFormValues } from '@/src/schemas/pedido.schema';

// ─── Tipus interns ────────────────────────────────────────────────────────────

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
    clientes: { id_cliente: number; nombre: string } | { id_cliente: number; nombre: string }[];
    lineas_pedido: {
        id_linea_pedido: number;
        cantidad_total: number;
        importe_linea: number;
        dias_alquiler: number;
        precio_dia: number;
        id_producto: number;
    }[];
};

// ─── Mapper ───────────────────────────────────────────────────────────────────

const mapPedido = (row: PedidoRow): PedidoConDetalle => {
    const cliente = Array.isArray(row.clientes) ? row.clientes[0] : row.clientes;
    return {
        id: row.id_pedido,
        codigo: row.codigo,
        clienteId: row.id_cliente,
        fechaInicio: row.fecha_inicio,
        fechaFin: row.fecha_fin,
        estado: row.estado,
        creadoPor: row.creado_por,
        notas: row.notas ?? undefined,
        cliente: {
            id: cliente.id_cliente,
            nombre: cliente.nombre,
            activo: true,
            direccion: { id: 0, linea1: '', esPrincipal: true },
        },
        lineas: row.lineas_pedido.map(l => ({
            id: l.id_linea_pedido,
            pedidoId: row.id_pedido,
            productoId: l.id_producto,
            precioDia: l.precio_dia,
            diasAlquiler: l.dias_alquiler,
            cantidadTotal: l.cantidad_total,
            importeLinea: l.importe_linea,
            producto: { id: l.id_producto, nombre: '', precioDia: l.precio_dia },
        })),
        totalUnidades: row.lineas_pedido.reduce((s, l) => s + l.cantidad_total, 0),
        totalImporte: row.lineas_pedido.reduce((s, l) => s + l.importe_linea, 0),
    };
};

// ─── Selecció comuna ──────────────────────────────────────────────────────────

const PEDIDO_SELECT = `
    id_pedido, codigo, id_cliente, id_direccion_entrega, id_direccion_recogida,
    fecha_inicio, fecha_fin, estado, creado_por, notas,
    clientes(id_cliente, nombre),
    lineas_pedido(id_linea_pedido, id_producto, cantidad_total, dias_alquiler, precio_dia, importe_linea)
`;

// ─── Helpers privats ──────────────────────────────────────────────────────────

async function getDireccioClient(clienteId: number): Promise<number | null> {
    const { data, error } = await supabase
        .from('direcciones_cliente')
        .select('id_direccion')
        .eq('id_cliente', clienteId)
        .eq('es_principal', true)
        .maybeSingle();
    return data?.id_direccion ?? null;
}

async function getPreciosMap(productoIds: number[]): Promise<Map<number, number>> {
    const { data, error } = await supabase
        .from('productos')
        .select('id_producto, precio_dia')
        .in('id_producto', productoIds);
    if (error || !data) throw new Error('No s\'han pogut obtenir els preus dels productes.');
    return new Map(data.map(p => [p.id_producto, p.precio_dia]));
}

function calcularDiasAlquiler(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaMs = fin.getTime() - inicio.getTime();
    if (isNaN(diferenciaMs) || diferenciaMs < 0) return 0;
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)) + 1;
}

/** Construeix les files a inserir a lineas_pedido */
function buildLineas(
    pedidoId: number,
    lineas: PedidoFormValues['lineas'],
    preciosMap: Map<number, number>,
    fechaInicio: string,
    fechaFin: string
) {
    const diasAlquiler = calcularDiasAlquiler(fechaInicio, fechaFin);

    return lineas.map(l => {
        const precioDia = preciosMap.get(l.productoId) ?? 0;
        return {
            id_pedido: pedidoId,
            id_producto: l.productoId,
            cantidad_total: l.cantidad,
            dias_alquiler: diasAlquiler,
            precio_dia: precioDia,
            importe_linea: precioDia * l.cantidad * diasAlquiler,
        };
    });
}

// ─── Servei ───────────────────────────────────────────────────────────────────

export const pedidoService = {

    getActivos: async (): Promise<PedidoConDetalle[]> => {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('pedidos')
            .select(PEDIDO_SELECT)
            .lte('fecha_inicio', today)
            .gte('fecha_fin', today)
            .neq('estado', 'FINALIZADO');
        if (error || !data) throw new Error('No s\'han pogut carregar els pedidos actius.');
        return data.map(mapPedido);
    },

    getAll: async (): Promise<PedidoConDetalle[]> => {
        const { data, error } = await supabase
            .from('pedidos')
            .select(PEDIDO_SELECT)
            .order('fecha_inicio', { ascending: false });
        if (error || !data) throw new Error('No s\'han pogut carregar els pedidos.');
        return data.map(mapPedido);
    },

    getByClienteId: async (clienteId: number): Promise<PedidoConDetalle[]> => {
        const { data, error } = await supabase
            .from('pedidos')
            .select(PEDIDO_SELECT)
            .eq('id_cliente', clienteId)
            .order('fecha_inicio', { ascending: false });
        if (error || !data) throw new Error('No s\'han pogut carregar els pedidos del client.');
        return data.map(mapPedido);
    },

    getById: async (id: number): Promise<PedidoConDetalle | null> => {
        const { data, error } = await supabase
            .from('pedidos')
            .select(PEDIDO_SELECT)
            .eq('id_pedido', id)
            .maybeSingle();
        if (error) throw new Error('No s\'ha pogut carregar el pedido.');
        if (!data) return null;
        return mapPedido(data as PedidoRow);
    },

    create: async (pedido: PedidoFormValues, creadoPor: number): Promise<void> => {
        const productoIds = pedido.lineas.map(l => l.productoId);

        const [direccioId, preciosMap] = await Promise.all([
            getDireccioClient(pedido.clienteId),
            getPreciosMap(productoIds),
        ]);

        const { data: inserted, error: pedidoError } = await supabase
            .from('pedidos')
            .insert({
                codigo: `P-${Date.now()}`,
                id_cliente: pedido.clienteId,
                id_direccion_entrega: direccioId,
                id_direccion_recogida: direccioId,
                fecha_inicio: pedido.fechaInicio,
                fecha_fin: pedido.fechaFin,
                estado: pedido.estado,
                creado_por: creadoPor,
                notas: pedido.notas ?? null,
            })
            .select('id_pedido')
            .single();

        if (pedidoError || !inserted) throw new Error('No s\'ha pogut crear el pedido.');

        const lineas = buildLineas(inserted.id_pedido, pedido.lineas, preciosMap, pedido.fechaInicio, pedido.fechaFin);

        const { error: lineasError } = await supabase
            .from('lineas_pedido')
            .insert(lineas);


        if (lineasError) throw new Error('El pedido s\'ha creat però no s\'han pogut guardar les línies.');
    },

    update: async (id: number, pedido: PedidoFormValues): Promise<void> => {
        const [direccioId, preciosMap] = await Promise.all([
            getDireccioClient(pedido.clienteId),
            getPreciosMap(pedido.lineas.map(l => l.productoId)),
        ]);

        const { error: pedidoError } = await supabase
            .from('pedidos')
            .update({
                id_cliente: pedido.clienteId,
                id_direccion_entrega: direccioId,
                id_direccion_recogida: direccioId,
                fecha_inicio: pedido.fechaInicio,
                fecha_fin: pedido.fechaFin,
                estado: pedido.estado,
                notas: pedido.notas ?? null,
            })
            .eq('id_pedido', id);

        if (pedidoError) {
            throw new Error(`No s'ha pogut actualitzar el pedido: ${pedidoError.message}`);
        }

        const { error: deleteError } = await supabase
            .from('lineas_pedido')
            .delete()
            .eq('id_pedido', id);

        if (deleteError) {
            throw new Error(`No s'han pogut esborrar les línies antigues: ${deleteError.message}`);
        }

        const nuevasLineas = buildLineas(id, pedido.lineas, preciosMap, pedido.fechaInicio, pedido.fechaFin);

        const { error: lineasError } = await supabase
            .from('lineas_pedido')
            .insert(nuevasLineas);

        if (lineasError) {
            throw new Error(`No s'han pogut guardar les noves línies del pedido: ${lineasError.message}`);
        }
    },

    updateEstado: async (id: number, estado: EstadoPedido): Promise<void> => {
        const { error } = await supabase
            .from('pedidos')
            .update({ estado })
            .eq('id_pedido', id);
        if (error) throw new Error('No s\'ha pogut actualitzar l\'estat del pedido.');
    },
};