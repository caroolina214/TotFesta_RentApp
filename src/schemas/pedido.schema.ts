import { z } from 'zod';

export const pedidoSchema = z.object({
    clienteId: z.number({ required_error: 'El client és obligatori' }),
    fechaInicio: z.string().min(1, 'La data d\'inici és obligatòria'),
    fechaFin: z.string().min(1, 'La data de fi és obligatòria'),
    estado: z.enum(['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO', 'CANCELADO']),
    notas: z.string().optional(),
}).refine(data => data.fechaFin >= data.fechaInicio, {
    message: 'La data de fi ha de ser posterior a la d\'inici',
    path: ['fechaFin'],
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;