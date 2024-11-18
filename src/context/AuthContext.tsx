'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { getIdTokenResult } from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps>({ user: null, isAdmin: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User logged in:', user); // Add logging
        setUser(user);
        const tokenResult = await getIdTokenResult(user);
        setIsAdmin(tokenResult.claims.role === 'admin');
      } else {
        console.log('User logged out'); // Add logging
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);