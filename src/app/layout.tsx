import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthProviderClient from "../components/AuthProviderClient";

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
          <Header />
          <main className="mx-auto max-w-screen-2xl min-h-96 md:p-10 p-4">
            {children}
          </main>
          <Footer />
        </AuthProviderClient>
      </body>
    </html>
  );
}