import { supabase } from '@/src/config/supabaseClient';
import { RegisterFormValues } from '@/src/schemas/auth.schema';

export const authService = {
    register: async (data: RegisterFormValues) => {
        const { data: authData, error: authError } =
            await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

        if (authError) {
            throw authError;
        }

        if (!authData.user) {
            throw new Error("No s'ha pogut crear l'usuari.");
        }

        const { data: usuarioData, error: usuarioError } =
            await supabase
                .from('usuarios')
                .insert({
                    auth_user_id: authData.user.id,
                    nombre: data.nombre,
                    email: data.email,
                    id_rol: 3,
                })
                .select('id_usuario')
                .single();

        if (usuarioError || !usuarioData) {
            throw new Error("Error creant el registre d'usuari.");
        }

        const { data: clienteData, error: clienteError } =
            await supabase
                .from('clientes')
                .insert({
                    nombre: data.nombre,
                    telefono: data.telefono,
                    email: data.email,
                    activo: true,
                })
                .select('id_cliente')
                .single();

        if (clienteError || !clienteData) {
            throw new Error('Error creant el client.');
        }

        const { error: direccionError } =
            await supabase
                .from('direcciones_cliente')
                .insert({
                    id_cliente: clienteData.id_cliente,
                    linea1: data.direccion.linea1,
                    ciudad: data.direccion.ciudad,
                    codigo_postal: data.direccion.codigoPostal,
                    es_principal: true,
                });

        if (direccionError) {
            throw new Error('Error creant la direcció.');
        }

        return {
            usuarioId: usuarioData.id_usuario,
            clienteId: clienteData.id_cliente,
        };
    },
};