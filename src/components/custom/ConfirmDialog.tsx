import AppButton from '@/src/components/custom/AppButton';
import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';
import { Modal, Pressable, useColorScheme, View } from 'react-native';

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
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                onPress={onClose}
            >
                <Pressable
                    style={{ backgroundColor: isDark ? AppColors.MoratObscur : 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}
                    onPress={() => { }}
                >
                    <Text className="text-xl font-fuzzy-bold text-festa-morat" style={{ marginBottom: 8 }}>
                        {title}
                    </Text>
                    <Text className="font-schibsted" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur, marginBottom: 24 }}>
                        {message}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
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
                            onPress={() => { onClose(); setTimeout(() => onConfirm(), 100); }}
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