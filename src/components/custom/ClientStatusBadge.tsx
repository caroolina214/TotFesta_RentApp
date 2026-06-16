import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';
import { View } from 'react-native';

interface ClientStatusBadgeProps {
    activo: boolean;
}

export default function ClientStatusBadge({ activo }: ClientStatusBadgeProps) {
    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: activo ? AppColors.VerdClar : AppColors.FucsiaClar,
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
            shadowColor: AppColors.BaseObscur,
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.3, shadowRadius: 2, elevation: 3,
        }}>
            <View style={{
                width: 10, height: 10, borderRadius: 50,
                backgroundColor: activo ? AppColors.Verd : AppColors.Fucsia,
                shadowColor: AppColors.BaseObscur,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.4, shadowRadius: 2, elevation: 2,
            }} />
            <Text style={{ fontSize: 12, fontFamily: 'SchibstedGrotesk', color: activo ? AppColors.VerdObscur : AppColors.FucsiaObscur }}>
                {activo ? 'Actiu' : 'Inactiu'}
            </Text>
        </View>
    );
}