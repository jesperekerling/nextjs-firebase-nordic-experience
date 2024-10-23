import React from 'react';
import LoginForm from '../../components/LoginForm';

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;