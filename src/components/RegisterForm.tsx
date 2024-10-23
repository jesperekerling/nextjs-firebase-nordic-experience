import { useState } from "react";
import { auth, createUserWithEmailAndPassword, googleProvider, signInWithPopup } from "../../firebase/firebaseConfig";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch (err) {
      setError("Failed to register. Please check your credentials.");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Registration with Google successful!");
    } catch (err) {
      setError("Failed to register with Google.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
        Register
      </button>
      <button type="button" onClick={handleGoogleRegister} className="p-2 bg-red-500 text-white rounded">
        Register with Google
      </button>
    </form>
  );
}