import { Text } from '@/src/components/ui/text';
import { FormControlLabelText } from '@/src/components/ui/form-control';
import { useColorScheme } from 'react-native';
import { AppColors } from '@/src/constants/colors';

interface RequiredLabelProps {
    label: string;
}

export default function RequiredLabel({ label }: RequiredLabelProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
            {label} <Text style={{ color: AppColors.Fucsia }}>*</Text>
        </FormControlLabelText>
    );
}