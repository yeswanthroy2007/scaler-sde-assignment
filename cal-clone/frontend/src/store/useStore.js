import { create } from 'zustand';

const useStore = create((set) => ({
    user: { name: 'Demo User', email: 'demo@example.com' },
    setUser: (user) => set({ user }),
}));

export default useStore;
