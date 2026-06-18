import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('El correu electrònic no és vàlid'),
    password: z.string().min(1, 'La contrasenya és obligatòria'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        nombre: z.string().min(2, 'El nom ha de tindre almenys 2 caràcters'),
        email: z.string().email('El correu electrònic no és vàlid'),
        password: z.string().min(8, 'Mínim 8 caràcters'),
        confirmPassword: z.string().min(1, 'Confirma la contrasenya'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les contrasenyes no coincideixen',
        path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;