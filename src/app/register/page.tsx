import React from 'react';
import Link from 'next/link';
import RegisterForm from './(components)/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl mb-4">Register</h1>
      <RegisterForm />

      <p className='pt-10'>or</p>
      <Link href="/login" className='py-10'><span className='font-semibold'>Log in</span> to your account</Link>
    </div>
  );
};

export default RegisterPage;