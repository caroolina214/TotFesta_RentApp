import { FormControlLabelText } from '@/src/components/ui/form-control';
import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers/ThemeProvider';

interface RequiredLabelProps {
    label: string;
}

export default function RequiredLabel({ label }: RequiredLabelProps) {
    const { isDark } = useThemeContext();

    return (
        <FormControlLabelText className="font-schibsted text-sm" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
            {label} <Text style={{ color: AppColors.Fucsia }}>*</Text>
        </FormControlLabelText>
    );
}