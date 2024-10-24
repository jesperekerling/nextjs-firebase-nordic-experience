'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      // Clear the user's session or token here
      // For example, if using cookies:
      document.cookie = 'token=; Max-Age=0; Path=/; HttpOnly';

      // Redirect to the login page or home page
      router.push('/login');
    };

    logout();
  }, [router]);

  return <p>Logging out...</p>;
};

export default LogoutPage;