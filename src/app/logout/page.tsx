'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebase/firebaseConfig'; // Adjust the path as needed
import { signOut } from 'firebase/auth';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // Sign out from Firebase Authentication
        await signOut(auth);

        // Clear the user's session or token here
        // For example, if using cookies:
        document.cookie = 'token=; Max-Age=0; Path=/; HttpOnly';

        // Redirect to the login page or home page
        router.push('/');
      } catch (error) {
        console.error('Failed to log out:', error);
      }
    };

    logout();
  }, [router]);

  return <p>Logging out...</p>;
};

export default LogoutPage;