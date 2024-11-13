'use client';

import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-60 p-10 z-10 dark:bg-opacity-80">
      <div ref={modalRef} className="relative w-full md:w-4/5 bg-white p-2 rounded shadow-lg max-h-full overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 px-2 text-5xl text-white bg-black bg-opacity-20 dark:text-white z-50">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;