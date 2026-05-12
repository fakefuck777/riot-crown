'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem } from '~/lib/cartTypes';
import { loadCartFromStorage, saveCartToStorage } from '~/lib/cartStorage';

function lineMatch(a: Pick<CartItem, 'id' | 'size'>, b: Pick<CartItem, 'id' | 'size'>) {
  return a.id === b.id && (a.size ?? '') === (b.size ?? '');
}

interface CartContextValue {
  items:           CartItem[];
  isOpen:          boolean;
  isCheckoutOpen:  boolean;
  addToCart:       (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart:  (id: string, size?: string) => void;
  updateQty:       (id: string, qty: number, size?: string) => void;
  openCart:        () => void;
  closeCart:       () => void;
  openCheckout:    () => void;
  closeCheckout:   () => void;
}

const CartContext = createContext<CartContextValue>({
  items:          [],
  isOpen:         false,
  isCheckoutOpen: false,
  addToCart:      () => {},
  removeFromCart: () => {},
  updateQty:      () => {},
  openCart:       () => {},
  closeCart:      () => {},
  openCheckout:   () => {},
  closeCheckout:  () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,          setItems]          = useState<CartItem[]>([]);
  const [isOpen,         setIsOpen]         = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartHydrated,   setCartHydrated]   = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    saveCartToStorage(items);
  }, [items, cartHydrated]);

  const addToCart = useCallback((incoming: Omit<CartItem, 'qty'>) => {
    setItems(prev => {
      const existing = prev.find(i => lineMatch(i, incoming));
      if (existing) {
        return prev.map(i => (lineMatch(i, incoming) ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...incoming, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string, size?: string) => {
    setItems(prev => prev.filter(i => !lineMatch(i, { id, size })));
  }, []);

  const updateQty = useCallback((id: string, qty: number, size?: string) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !lineMatch(i, { id, size })));
    } else {
      setItems(prev => prev.map(i => (lineMatch(i, { id, size }) ? { ...i, qty } : i)));
    }
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      isCheckoutOpen,
      addToCart,
      removeFromCart,
      updateQty,
      openCart:      () => setIsOpen(true),
      closeCart:     () => setIsOpen(false),
      openCheckout:  () => { setIsOpen(false); setIsCheckoutOpen(true); },
      closeCheckout: () => setIsCheckoutOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
