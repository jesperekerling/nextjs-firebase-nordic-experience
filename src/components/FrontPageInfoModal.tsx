'use client'
import React from 'react'
import Modal from "../components/Modal"; // Import the Modal component
import { useState } from 'react';



function FrontPageInfoModal() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };


  return (
    <div>
        <p className="text-grey2 py-3">Ready to go packages</p>
    <p>
      <button onClick={handleOpenModal} className="text-primary font-semibold">
        Learn more
      </button>
    </p>
    
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold pb-4">Ready to go travel packages</h2>
        <p>Discover a seamless travel app where you can easily book complete travel packages with activities, accommodation, and restaurants included. Customize your experience with carefully selected options for a stress-free and memorable vacation!</p>
      </Modal>
    
    </div>
  )
}

export default FrontPageInfoModal