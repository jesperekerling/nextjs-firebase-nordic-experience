'use client';
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Modal from "../components/Modal"; // Import the Modal component
import PackageList from "../components/PackageList"; // Import the PackageList component

const LoginForm = dynamic(() => import("../components/LoginForm"), { ssr: false });
const RegisterForm = dynamic(() => import("../components/RegisterForm"), { ssr: false });

export default function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <section className="text-center">
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="text-grey2 py-3">Ready to go packages</p>
          <p>
            <button onClick={handleOpenModal} className="text-primary font-semibold">
              Learn more
            </button>
          </p>
        </section>
        <section className="mt-8">
          <PackageList />
        </section>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold pb-4">Ready to go travel packages</h2>
        <p>Discover a seamless travel app where you can easily book complete travel packages with activities, accommodation, and restaurants included. Customize your experience with carefully selected options for a stress-free and memorable vacation!</p>
      </Modal>
    </div>
  );
}