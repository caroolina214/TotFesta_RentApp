import { useState } from 'react';
import { Pressable } from 'react-native';
import { Card } from '@/src/components/ui/card';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { Client } from '@/src/types/Client';

type Props = {
    clients: Client[];
    value: number;
    onChange: (id: number) => void;
    inputClass: string;
};

export default function ClientSelector({ clients, value, onChange, inputClass }: Props) {
    const { isDark } = useThemeContext();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selected = clients.find(c => c.id === value);
    const filtered = clients.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()));

    return (
        <VStack space="xs">
            <Pressable onPress={() => setOpen(!open)}>
                <Card className={`p-2 rounded-md border ${isDark ? 'border-festa-aqua bg-festa-aquaObscur' : 'border-festa-aquaObscur bg-festa-aquaClar'}`}>
                    <Text className={`font-schibsted text-base ${!selected ? 'text-festa-baseMig' : ''}`}>
                        {selected ? selected.nombre : 'Selecciona un client'}
                    </Text>
                </Card>
            </Pressable>

            {open && (
                <VStack space="xs">
                    <Input className={inputClass}>
                        <InputField
                            placeholder="Buscar client..."
                            value={search}
                            onChangeText={setSearch}
                            style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}
                        />
                    </Input>
                    <VStack space="xs" style={{ marginTop: 6 }}>
                        {filtered.map(client => (
                            <Pressable key={client.id} onPress={() => { onChange(client.id); setOpen(false); setSearch(''); }}>
                                <Card className={`p-2 rounded-md ${value === client.id ? 'bg-festa-aquaClar' : isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                                    <Text className="font-schibsted text-base" style={{ color: value === client.id ? AppColors.AquaObscur : AppColors.BaseMig }}>
                                        {client.nombre}
                                    </Text>
                                </Card>
                            </Pressable>
                        ))}
                    </VStack>
                </VStack>
            )}
        </VStack>
    );
}