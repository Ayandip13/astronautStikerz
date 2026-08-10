import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { product, quantity, isCustomized, designId, previewImage }
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      
      addItem: (product, quantity = 1, options = {}) => {
        set((state) => {
          const { isCustomized = false, designId = null, previewImage = null } = options;
          
          // Check if same product (and same designId if customized) already exists
          const existingItemIndex = state.items.findIndex(
            item => 
              item.product._id === product._id && 
              item.isCustomized === isCustomized && 
              item.designId === designId
          );

          if (existingItemIndex > -1) {
            // Update quantity
            const newItems = [...state.items];
            const newQuantity = newItems[existingItemIndex].quantity + quantity;
            // Cap at available stock
            newItems[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
            return { items: newItems };
          } else {
            // Add new item
            const newItem = {
              product,
              quantity: Math.min(quantity, product.stock),
              isCustomized,
              designId,
              previewImage
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId, designId = null) => {
        set((state) => ({
          items: state.items.filter(
            item => !(item.product._id === productId && item.designId === designId)
          )
        }));
      },

      updateQuantity: (productId, quantity, designId = null) => {
        if (quantity < 1) return;
        
        set((state) => ({
          items: state.items.map(item => {
            if (item.product._id === productId && item.designId === designId) {
              return { ...item, quantity: Math.min(quantity, item.product.stock) };
            }
            return item;
          })
        }));
      },

      clearCart: () => set({ items: [] }),

      // Helpers that can be derived (Client-side estimation only, backend calculates real total)
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    }),
    {
      name: 'astronaut-cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);
