'use client'
import { useState } from "react";
import { auth, signInWithEmailAndPassword, googleProvider, signInWithPopup } from "../../firebase/firebaseConfig";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
    } catch (err) {
      setError("Failed to login with Google.");
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <p>You are logged in.</p>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Login
          </button>
          <button type="button" onClick={handleGoogleLogin} className="p-2 bg-red-500 text-white rounded">
            Login with Google
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;