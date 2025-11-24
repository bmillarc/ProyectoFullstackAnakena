import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreItem } from '../types/store';
import polera1 from '../assets/store/polera1.jpeg';
import polera2 from '../assets/store/polera2.jpeg';
import polera3 from '../assets/store/polera3.jpeg';

export interface CartItem extends StoreItem { quantity: number; }

export interface StoreState {
  items: StoreItem[];
  cart: CartItem[];
  addToCart: (item: StoreItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  findInCart: (id: number) => CartItem | undefined;
}

const mockStoreItems: StoreItem[] = [
  { id: 1, label: 'Polera Anakena (local)', price: '$$$$', image: polera1, category: 'Poleras' },
  { id: 2, label: 'Polera Anakena (visita)', price: '$$$$', image: polera2, category: 'Poleras' },
  { id: 3, label: 'Polera Anakena (DR)', price: '$$$$', image: polera3, category: 'Poleras' }
];

export const useStoreStore = create<StoreState>()(persist((set, get) => ({
  items: mockStoreItems,
  cart: [],
  addToCart: (item) => {
    const existing = get().cart.find(c => c.id === item.id);
    if (existing) {
      set({ cart: get().cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) });
    } else {
      set({ cart: [...get().cart, { ...item, quantity: 1 }] });
    }
  },
  removeFromCart: (id) => {
    const existing = get().cart.find(c => c.id === id);
    if (!existing) return;
    if (existing.quantity > 1) {
      set({ cart: get().cart.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c) });
    } else {
      set({ cart: get().cart.filter(c => c.id !== id) });
    }
  },
  clearCart: () => set({ cart: [] }),
  totalItems: () => get().cart.reduce((acc, c) => acc + c.quantity, 0),
  findInCart: (id) => get().cart.find(c => c.id === id)
}), { name: 'anakena-store-cart' }));
