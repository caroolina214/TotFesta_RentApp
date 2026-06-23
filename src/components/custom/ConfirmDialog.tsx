import AppButton from '@/src/components/custom/AppButton';
import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers/ThemeProvider';
import { Modal, Pressable, View } from 'react-native';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    visible,
    title,
    message,
    onConfirm,
    onClose,
    confirmText = 'Confirmar',
    cancelText = 'Cancel·lar',
}: ConfirmDialogProps) {
    const { isDark } = useThemeContext();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 items-center justify-center p-6 bg-black/75"
                onPress={onClose}
            >
                <Pressable
                    className={`rounded-2xl p-6 w-full max-w-[400px] ${isDark ? 'bg-festa-aquaClar' : 'bg-festa-baseClar'}`}
                    onPress={() => { }}
                >
                    <Text className="text-xl font-fuzzy-bold mb-2 text-festa-morat">
                        {title}
                    </Text>
                    <Text className="font-schibsted mb-6 text-festa-baseObscur">
                        {message}
                    </Text>
                    <View className="flex-row justify-end gap-3">
                        <AppButton
                            label={cancelText}
                            onPress={onClose}
                            textColor={AppColors.BaseObscur}
                            bgColor={AppColors.BaseMig}
                            outlined
                            shadow
                        />
                        <AppButton
                            label={confirmText}
                            onPress={async () => { await onConfirm(); onClose(); }}
                            bgColor={AppColors.Aqua}
                            textColor={AppColors.BaseObscur}
                            outlined
                            outlineColor={AppColors.AquaObscur}
                            shadow
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}