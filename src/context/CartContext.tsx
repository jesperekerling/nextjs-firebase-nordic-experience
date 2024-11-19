'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from "@/types/bookings";
import { PackageBooking } from "@/types/packageBookings";

interface CartContextProps {
  cart: (Booking | PackageBooking)[];
  addToCart: (booking: Booking | PackageBooking) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<(Booking | PackageBooking)[]>([]);

  const addToCart = (booking: Booking | PackageBooking) => {
    setCart((prevCart) => [...prevCart, booking]);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter(booking => booking.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
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