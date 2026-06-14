import { Modal, View, Pressable, useColorScheme } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { AppColors } from '@/src/constants/colors';

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
                        <Pressable
                            onPress={onClose}
                            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: AppColors.BaseMig }}
                        >
                            <Text className="font-schibsted text-festa-baseMig">{cancelText}</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { onClose(); setTimeout(() => onConfirm(), 100); }}
                            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: AppColors.Aqua }}
                        >
                            <Text className="font-schibsted" style={{ color: AppColors.BaseObscur }}>{confirmText}</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}