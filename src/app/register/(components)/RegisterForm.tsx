'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { auth, createUserWithEmailAndPassword, updateProfile } from "../../../../firebase/firebaseConfig";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/'); // Redirect to the front page
    } catch (err: any) {
      // Display specific error message from Firebase
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-gray-300 rounded dark:text-black"
      />
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
      <button type="submit" className="p-2 bg-primary font-semibold text-white rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;