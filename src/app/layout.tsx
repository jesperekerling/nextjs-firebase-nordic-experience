import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from '@/context/CartContext';
import AuthProviderClient from "../components/AuthProviderClient";
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProviderClient>
          <CartProvider>
            <Header />
            <main className="mx-auto max-w-screen-2xl min-h-96 md:p-10 p-4">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" reverseOrder={false} />
          </CartProvider>
        </AuthProviderClient>
      </body>
    </html>
  );
}