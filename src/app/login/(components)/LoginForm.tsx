'use client'
import { useState } from "react";
import { auth, signInWithEmailAndPassword, googleProvider, signInWithPopup } from "../../../../firebase/firebaseConfig";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext"; // Import the useAuth hook

function LoginForm() {
  const { user } = useAuth(); // Get the current user from the useAuth hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
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