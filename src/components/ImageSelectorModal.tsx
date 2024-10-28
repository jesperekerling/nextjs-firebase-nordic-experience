'use client';
import React, { useRef, useEffect } from 'react';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageList: string[];
  onSelectImage: (url: string) => void;
}

const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({ isOpen, onClose, imageList, onSelectImage }) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-10">
      <div ref={modalRef} className="relative bg-white p-6 rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 px-2">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Select Image</h2>
        <div className="image-list grid grid-cols-3 gap-4">
          {imageList.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Image ${index}`}
              style={{ width: '100px', height: '100px', cursor: 'pointer' }}
              onClick={() => onSelectImage(url)}
            />
          ))}
        </div>
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Save</button>
      </div>
    </div>
  );
};

export default ImageSelectorModal;