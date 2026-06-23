import { supabase } from '@/src/config/supabaseClient';
import { Producte } from '@/src/types/Producte';

type ProducteRow = {
    id_producto: number;
    nombre: string;
    descripcion: string | null;
    precio_dia: number;
    activo: boolean;
};

const mapProducto = (row: ProducteRow): Producte => ({
    id: row.id_producto,
    nombre: row.nombre,
    descripcion: row.descripcion ?? undefined,
    precioDia: row.precio_dia,
    activo: row.activo,
});

export const producteService = {
    getAll: async (): Promise<Producte[]> => {
        const { data, error } = await supabase
            .from('productos')
            .select('id_producto, nombre, descripcion, precio_dia, activo')
            .eq('activo', true)
            .order('nombre');
        if (error || !data) throw new Error('No s\'han pogut carregar els productes.');
        return data.map(mapProducto);
    },
};