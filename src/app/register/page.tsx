import React from 'react';
import RegisterForm from '../../components/RegisterForm';
import Link from 'next/link';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl mb-4">Register</h1>
      <RegisterForm />

      <p>or</p>
      <Link href="/login">Login to your account</Link>
    </div>
  );
};

export default RegisterPage;