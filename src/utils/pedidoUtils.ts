import { AppColors } from '@/src/constants/colors';
import { EstadoPedido } from '@/src/types/types';

const estadoLabel: Record<EstadoPedido, string> = {
    PREPARADO: 'En preparació',
    ENTREGADO: 'Entregat',
    DEVUELTO: 'Retornat',
    PENDIENTE_REVISION: 'Pendent revisió',
    FINALIZADO: 'Finalitzat',
    CANCELADO: 'Cancel·lat',
};

const estadoColors: Record<EstadoPedido, { bg: string; text: string }> = {
    PREPARADO: { bg: AppColors.AquaClar, text: AppColors.AquaObscur },
    ENTREGADO: { bg: AppColors.VerdClar, text: AppColors.VerdObscur },
    DEVUELTO: { bg: AppColors.GrocClar, text: AppColors.GrocObscur },
    PENDIENTE_REVISION: { bg: AppColors.FucsiaClar, text: AppColors.FucsiaObscur },
    FINALIZADO: { bg: AppColors.MoratClar, text: AppColors.MoratObscur },
    CANCELADO: { bg: AppColors.BaseMig, text: AppColors.BaseObscur },
};

export const getEstadoBg = (estado: EstadoPedido) => {
    return estadoColors[estado] ?? { bg: AppColors.BaseClar, text: AppColors.BaseMig };
};

export const getEstadoLabel = (estado: EstadoPedido) => {
    return estadoLabel[estado] ?? estado;
};