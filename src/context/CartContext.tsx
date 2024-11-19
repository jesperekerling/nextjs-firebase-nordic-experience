'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from "@/types/bookings";

interface CartContextProps {
  cart: Booking[];
  addToCart: (booking: Booking) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Booking[]>([]);

  const addToCart = (booking: Booking) => {
    setCart((prevCart) => [...prevCart, booking]);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};