import { Client, DireccioClient } from './Client';

export type EstadoPedido =
    | 'PREPARADO'
    | 'ENTREGADO'
    | 'DEVUELTO'
    | 'PENDIENTE_REVISION'
    | 'FINALIZADO'
    | 'CANCELADO';

export interface Pedido {
    id: number;
    codigo: string;
    clienteId: number;
    direccionEntregaId?: number;
    direccionRecogidaId?: number;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoPedido;
    creadoPor: number;
    notas?: string;
}

export interface LineaPedido {
    id: number;
    pedidoId: number;
    productoId: number;
    precioDia: number;
    diasAlquiler: number;
    cantidadTotal: number;
    importeLinea: number;
}

export interface LineaPedidoConDetalle extends LineaPedido {
    producto: {
        id: number;
        nombre: string;
        precioDia: number;
    };
}

export interface PedidoConDetalle extends Pedido {
    cliente: Client;
    direccionEntrega?: DireccioClient;
    direccionRecogida?: DireccioClient;
    lineas: LineaPedidoConDetalle[];
    totalUnidades: number;
    totalImporte: number;
}