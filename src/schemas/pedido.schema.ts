import { z } from 'zod';

export const lineaPedidoSchema = z.object({
    productoId: z.number({ required_error: 'El producte és obligatori' }).min(1, 'Selecciona un producte'),
    cantidad: z.number().min(1, 'La quantitat ha de ser almenys 1'),
    diasAlquiler: z.number().min(1, 'Els dies han de ser almenys 1'),
});

export const pedidoSchema = z.object({
    clienteId: z.number({ required_error: 'El client és obligatori' }).min(1, 'Selecciona un client'),
    fechaInicio: z.string().min(1, 'La data d\'inici és obligatòria'),
    fechaFin: z.string().min(1, 'La data de fi és obligatòria'),
    estado: z.enum(['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO', 'CANCELADO']),
    notas: z.string().optional(),
    lineas: z.array(lineaPedidoSchema).min(1, 'El pedido ha de tindre almenys una línia'),
})
    .refine(data => data.fechaFin >= data.fechaInicio, {
        message: 'La data de fi ha de ser posterior o igual a la d\'inici',
        path: ['fechaFin'],
    })
    .refine(data => {
        const ids = data.lineas.map(l => l.productoId);
        return new Set(ids).size === ids.length;
    }, {
        message: 'No es pot afegir el mateix producte dues vegades',
        path: ['lineas'],
    });

export type PedidoFormValues = z.infer<typeof pedidoSchema>;