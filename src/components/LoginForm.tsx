import { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../firebase/firebaseConfig";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
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
    </form>
  );
}