import { Text } from '@/src/components/ui/text';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from '@/src/components/ui/alert-dialog';
import { Button, ButtonText } from '@/src/components/ui/button';
import { useColorScheme } from 'react-native';
import { AppColors } from '@/src/constants/colors';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmClassName?: string;
}

export default function ConfirmDialog({
    visible,
    title,
    message,
    onConfirm,
    onClose,
    confirmText = 'Confirmar',
    cancelText = 'Cancel·lar',
    confirmClassName = 'bg-festa-aqua',
}: ConfirmDialogProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <AlertDialog isOpen={visible} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className={isDark ? 'bg-festa-moratObscur' : 'bg-white'}>
                <AlertDialogHeader>
                    <Text className="text-xl font-fuzzy-bold text-festa-morat">{title}</Text>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Text className="font-schibsted pb-5" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                        {message}
                    </Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button variant="outline" onPress={onClose} className="border-festa-baseMig">
                        <ButtonText className="font-schibsted text-festa-baseMig">{cancelText}</ButtonText>
                    </Button>
                    <Button onPress={() => { onConfirm(); onClose(); }} className={confirmClassName}>
                        <ButtonText className="font-schibsted text-festa-baseObscur">{confirmText}</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}