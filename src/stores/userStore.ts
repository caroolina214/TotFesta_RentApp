import { create } from 'zustand';

interface UserState {
    id: number | null;
    clienteId: number | null;
    name: string;
    email: string;
    role: 'ADMIN' | 'WORKER' | 'CLIENT' | null;
    setUser: (user: {
        id: number;
        clienteId?: number | null;
        name: string;
        email: string;
        role: 'ADMIN' | 'WORKER' | 'CLIENT';
    }) => void;
    clearUser: () => void;
    updateName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    id: null,
    clienteId: null,
    name: '',
    email: '',
    role: null,
    setUser: (user) => set({
        id: user.id,
        clienteId: user.clienteId ?? null,
        name: user.name,
        email: user.email,
        role: user.role,
    }),
    clearUser: () => set({ id: null, clienteId: null, name: '', email: '', role: null }),
    updateName: (name) => set({ name }),
}));