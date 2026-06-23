import { create } from 'zustand';

interface UserState {
    id: number | null;
    name: string;
    email: string;
    role: 'ADMIN' | 'WORKER' | 'CLIENT' | null;
    setUser: (user: { id: number; name: string; email: string; role: 'ADMIN' | 'WORKER' | 'CLIENT' }) => void;
    clearUser: () => void;
    updateName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    id: null,
    name: '',
    email: '',
    role: null,
    setUser: (user) => set(user),
    clearUser: () => set({ id: null, name: '', email: '', role: null }),
    updateName: (name) => set({ name }),
}));