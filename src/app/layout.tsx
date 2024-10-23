'use client'
import React, { useEffect, useState } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchPackages } from "../utils/fetchPackages"; // Adjust the path as needed
import { DocumentData } from "firebase/firestore";

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
  const [packages, setPackages] = useState<DocumentData[]>([]);

  useEffect(() => {
    async function loadPackages() {
      const packagesList = await fetchPackages();
      setPackages(packagesList);
    }
    loadPackages();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>
          <h1>Packages</h1>
          <ul>
            {packages.map((pkg, index) => (
              <li key={index}>{JSON.stringify(pkg)}</li>
            ))}
          </ul>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}