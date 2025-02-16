"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { getProductById } from '@/utils/productService';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  giftMessage?: string;
  specialRequest?: string;
}

interface CartContextType {
  items: CartItem[];
  deliveryDate: string | null;
  setDeliveryDate: (date: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  const addToCart = async (product: {
    id: string;
    name: string;
    giftMessage?: string;
    specialRequest?: string;
  }) => {
    try {
      const productData = await getProductById(product.id);
      if (!productData) {
        console.error('Product not found');
        return;
      }

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.productId === product.id);
        
        if (existingItem) {
          return currentItems.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...currentItems, {
          id: Date.now().toString(), // Cart item ID
          productId: product.id,     // Actual product ID from database
          name: product.name,
          quantity: 1,
          price: productData.price,
          image: productData.image,
          giftMessage: product.giftMessage,
          specialRequest: product.specialRequest,
        }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      deliveryDate,
      setDeliveryDate,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getSubtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};