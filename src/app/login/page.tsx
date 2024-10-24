import React from 'react';
import LoginForm from '../../components/LoginForm';
import Link from 'next/link';

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl mb-4">Login</h1>
      <LoginForm />

      <p>or</p>
      <Link href="/register">Register new account</Link>
    </div>
  );
}

export default LoginPage;