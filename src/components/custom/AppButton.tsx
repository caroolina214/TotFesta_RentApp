import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';
import { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

interface AppButtonProps {
    label: string;
    onPress: () => void;
    icon?: LucideIcon;
    bgColor?: string;
    textColor?: string;
    iconColor?: string;
    shadow?: boolean;
    disabled?: boolean;
    opacity?: number;
    uppercase?: boolean;
    centered?: boolean;
    bold?: boolean;
    fontSize?: number;
    iconSize?: number;
    outlined?: boolean;
    outlineColor?: string;
}

export default function AppButton({
    label,
    onPress,
    icon: Icon,
    bgColor = AppColors.AquaClar,
    textColor = AppColors.AquaObscur,
    iconColor,
    shadow = false,
    disabled = false,
    opacity = 1,
    uppercase = false,
    centered = false,
    bold = false,
    fontSize = 13,
    iconSize = 14,
    outlined = false,
    outlineColor = AppColors.BaseObscur,
}: AppButtonProps) {

    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const isActive = isHovered || isPressed;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: centered ? 'center' : 'flex-start',
                gap: 6,
                backgroundColor: bgColor,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                opacity: disabled ? 0.5 : opacity,
                borderWidth: outlined ? 1 : 0,
                borderColor: outlined ? outlineColor : 'transparent',
                shadowColor: shadow && !disabled ? AppColors.BaseObscur : 'transparent',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: shadow && !disabled ? 0.3 : 0,
                shadowRadius: 2,
                elevation: shadow && !disabled ? 3 : 0,
            }}
        >
            {isActive && !disabled && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    borderRadius: 8,
                    backgroundColor: 'rgba(0,0,0,0.12)',
                }} />
            )}
            {Icon && <Icon size={iconSize} color={iconColor ?? textColor} />}
            <Text style={{
                color: textColor,
                fontFamily: 'SchibstedGrotesk',
                fontWeight: bold ? '700' : '400',
                fontSize,
                textTransform: uppercase ? 'uppercase' : 'none',
            }}>
                {label}
            </Text>
        </Pressable>
    );
}