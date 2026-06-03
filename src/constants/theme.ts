import { AppColors } from './colors';

export const lightTheme = {
    colors: {
        primary: AppColors.Aqua,
        primaryLight: AppColors.AquaClar,
        primaryDark: AppColors.AquaObscur,
        secondary: AppColors.Morat,
        secondaryLight: AppColors.MoratClar,
        secondaryDark: AppColors.MoratObscur,
        accent: AppColors.Fucsia,
        accentLight: AppColors.FucsiaClar,
        accentDark: AppColors.FucsiaObscur,
        background: AppColors.BaseClar,
        text: AppColors.BaseObscur,
        textMuted: AppColors.BaseMig,
        success: AppColors.Verd,
        successLight: AppColors.VerdClar,
        successDark: AppColors.VerdObscur,
        warning: AppColors.Groc,
        warningLight: AppColors.GrocClar,
        warningDark: AppColors.GrocObscur,
    },
};

export const darkTheme = {
    colors: {
        primary: AppColors.Aqua,
        primaryLight: AppColors.AquaObscur,
        primaryDark: AppColors.AquaClar,
        secondary: AppColors.Morat,
        secondaryLight: AppColors.MoratObscur,
        secondaryDark: AppColors.MoratClar,
        accent: AppColors.Fucsia,
        accentLight: AppColors.FucsiaObscur,
        accentDark: AppColors.FucsiaClar,
        background: AppColors.BaseObscur,
        text: AppColors.BaseClar,
        textMuted: AppColors.BaseMig,
        success: AppColors.Verd,
        successLight: AppColors.VerdObscur,
        successDark: AppColors.VerdClar,
        warning: AppColors.Groc,
        warningLight: AppColors.GrocObscur,
        warningDark: AppColors.GrocClar,
    },
};

export type AppTheme = typeof lightTheme;