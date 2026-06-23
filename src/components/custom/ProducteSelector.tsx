import { Card } from '@/src/components/ui/card';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { AppColors } from '@/src/constants/colors';
import { useThemeContext } from '@/src/providers';
import { Producte } from '@/src/types/Producte';
import { useState } from 'react';
import { Pressable } from 'react-native';

type Props = {
    productos: Producte[];
    value: number;
    onChange: (id: number) => void;
    inputClass: string;
    usedIds: number[]; // per evitar duplicats
};

export default function ProducteSelector({ productos, value, onChange, inputClass, usedIds }: Props) {
    const { isDark } = useThemeContext();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selected = productos.find(p => p.id === value);
    // Filtra per búsqueda i exclou els ja usats (excepte el seleccionat actual)
    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) &&
        (!usedIds.includes(p.id) || p.id === value)
    );

    return (
        <VStack space="xs">
            <Pressable onPress={() => setOpen(!open)}>
                <Card className={`p-3 rounded-xl ${isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                    {selected ? (
                        <VStack>
                            <Text className="font-schibsted text-base" style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}>
                                {selected.nombre}
                            </Text>
                            <Text className="font-schibsted text-xs" style={{ color: AppColors.BaseMig }}>
                                Preu: {selected.precioDia} € / dia
                            </Text>
                        </VStack>
                    ) : (
                        <Text className="font-schibsted text-base" style={{ color: AppColors.BaseMig }}>
                            Selecciona un producte
                        </Text>
                    )}
                </Card>
            </Pressable>

            {open && (
                <VStack space="xs">
                    <Input className={inputClass}>
                        <InputField
                            placeholder="Buscar producte..."
                            value={search}
                            onChangeText={setSearch}
                            style={{ color: isDark ? AppColors.BaseClar : AppColors.BaseObscur }}
                        />
                    </Input>
                    <VStack space="xs" style={{ marginTop: 6 }}>
                        {filtered.map(prod => (
                            <Pressable key={prod.id} onPress={() => { onChange(prod.id); setOpen(false); setSearch(''); }}>
                                <Card className={`p-3 rounded-xl ${value === prod.id ? 'bg-festa-aquaClar' : isDark ? 'bg-festa-moratObscur' : 'bg-white'}`}>
                                    <VStack>
                                        <Text className="font-schibsted text-base" style={{ color: value === prod.id ? AppColors.AquaObscur : AppColors.BaseMig }}>
                                            {prod.nombre}
                                        </Text>
                                        <Text className="font-schibsted text-xs" style={{ color: AppColors.BaseMig }}>
                                            Preu: {prod.precioDia} € / dia
                                        </Text>
                                    </VStack>
                                </Card>
                            </Pressable>
                        ))}
                    </VStack>
                </VStack>
            )}
        </VStack>
    );
}