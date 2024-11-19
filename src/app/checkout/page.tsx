'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handlePayment = () => {
    // Implement payment logic here
    clearCart();
    alert("Payment successful!");
    router.push('/housing');
  };

  if (cart.length === 0) {
    return <div>No items in the cart.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <ul>
        {cart.map((booking, index) => (
          <li key={index} className="mb-4">
            <p>Housing: {booking.housingId}</p>
            <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Guests: {booking.guests}</p>
            <p>Total Price: ${booking.totalPrice}</p>
          </li>
        ))}
      </ul>
      <button onClick={handlePayment} className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80 mt-5">
        Pay
      </button>
    </div>
  );
};

export default CheckoutPage;