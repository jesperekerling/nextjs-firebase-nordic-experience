'use client'
import { useState } from "react";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../components/LoginForm"), { ssr: false });
const RegisterForm = dynamic(() => import("../components/RegisterForm"), { ssr: false });

export default function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button
          onClick={() => setShowLoginForm(!showLoginForm)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {showLoginForm ? "Hide Login Form" : "Show Login Form"}
        </button>
        {showLoginForm && <LoginForm />}
        
        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="p-2 bg-green-500 text-white rounded"
        >
          {showRegisterForm ? "Hide Register Form" : "Show Register Form"}
        </button>
        {showRegisterForm && <RegisterForm />}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}