'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { auth, signInWithEmailAndPassword, googleProvider, signInWithPopup } from "../../../../firebase/firebaseConfig";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

function LoginForm() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log('Current user:', user); // Add logging
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile'); // Redirect to /profile after successful login
    } catch {
      setError("Failed to login. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/profile'); // Redirect to /profile after successful login with Google
    } catch {
      setError("Failed to login with Google.");
    }
  };

  return (
    <div>
      {user ? (
        <div className="text-center">
          <p className="py-5">You are logged in.</p>
          <p>
            <Link href="/" className="py-5">
              <button className="bg-primary text-white py-3 px-5 rounded-md">Browse Packages</button>
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:text-black"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="p-2 bg-primary text-white rounded font-semibold">
            Login
          </button>
          <button type="button" onClick={handleGoogleLogin} className="p-2 bg-secondary text-black rounded font-semibold">
            Login with Google
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;