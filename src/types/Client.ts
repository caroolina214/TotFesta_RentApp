export interface DireccioClient {
    id: number;
    alias?: string;
    linea1: string;
    linea2?: string;
    ciudad?: string;
    provincia?: string;
    codigoPostal?: string;
    pais?: string;
    latitud?: number;
    longitud?: number;
    esPrincipal: boolean;
}

export interface Client {
    id: number;
    nombre: string;
    nifCif?: string;
    telefono?: string;
    email?: string;
    notas?: string;
    activo: boolean;
    direccion: DireccioClient;
    pedidosCount?: number;
}

export const clienteVuit: Client = {
    id: 0,
    nombre: '',
    nifCif: '',
    telefono: '',
    email: '',
    notas: '',
    activo: true,
    direccion: {
        id: 0,
        linea1: '',
        ciudad: '',
        codigoPostal: '',
        esPrincipal: true,
    },
};