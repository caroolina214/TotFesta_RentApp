import { z } from 'zod';

const nifCifRegex = /^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
const tlfRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]{3}[)])?([-]?[\s]?[0-9])+$/;

export const clientSchema = z.object({
    nombre: z
        .string({ required_error: 'El nom és obligatori' })
        .min(2, 'El nom ha de tindre almenys 2 caràcters'),

    nifCif: z
        .string()
        .min(9, 'El NIF/CIF ha de tenir 9 caràcters')
        .max(9, 'El NIF/CIF no pot superar els 9 caràcters')
        .regex(nifCifRegex, 'El format del NIF/CIF no és vàlid')
        .or(z.string().length(0))
        .optional(),

    telefono: z
        .string()
        .min(1, 'El telèfon és obligatori')
        .min(7, 'El telèfon és massa curt')
        .max(15, 'El telèfon és massa llarg')
        .refine((value) => tlfRegex.test(value), {
            message: 'Telèfon no vàlid',
        }),

    email: z
        .string()
        .email('El correu electrònic no és vàlid')
        .optional()
        .or(z.literal('')),

    notas: z
        .string()
        .max(500, 'Les notes no poden superar els 500 caràcters')
        .optional(),

    activo: z.boolean(),

    direccion: z.object({
        linea1: z.string().min(5, "L'adreça és massa curta"),
        ciudad: z.string().min(1, 'La ciutat és obligatòria'),
        codigoPostal: z
            .string()
            .min(5, 'El CP ha de tindre 5 dígits')
            .max(5, 'El CP ha de tindre 5 dígits'),
        esPrincipal: z.boolean().default(true),
    }),
});

export type ClientFormValues = z.infer<typeof clientSchema>;