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
        <p onClick={handleOpenModal} className="text-grey2 py-3 dark:text-gray-200 text-sm cursor-pointer">
          Learn more
        </p>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-10">
          <h2 className="text-xl font-bold pb-4 dark:text-black">Ready to go travel packages</h2>
          <p className="dark:text-black">Discover a seamless travel app where you can easily book complete travel packages with activities, accommodation, and restaurants included. Customize your experience with carefully selected options for a stress-free and memorable vacation!</p>
        </div>
      </Modal>
    
    </div>
  )
}

export default FrontPageInfoModal