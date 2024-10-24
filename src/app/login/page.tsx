'use client'
import React from 'react';
import LoginForm from '../../components/LoginForm';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as needed

const LoginPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl mb-4">Login</h1>
      <LoginForm />

      {!user && (
        <>
          <p className='pt-10'>or</p>
          <Link href="/register" className='py-10'>
            <span className='font-semibold'>Register</span> new account
          </Link>
        </>
      )}
    </div>
  );
};

export default LoginPage;