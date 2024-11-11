import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

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
    <div className="fixed inset-0 flex overflow-y-auto items-center justify-center bg-black bg-opacity-50 p-10 w-full">
      <div ref={modalRef} className="relative w-full bg-white p-6 rounded shadow-lg max-h-full overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-2 px-2">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Select Image</h2>
        <div className="image-list grid grid-cols-3 gap-6 w-full">
          {imageList.map((url, index) => {
            const filename = new URL(url).pathname.split('/').pop();
            return (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={url}
                  alt={`Image ${index}`}
                  width={150}
                  height={150}
                  className="object-cover rounded-lg aspect-square hover:opacity-80"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectImage(url)}
                />
                <span className="mt-2 text-xs text-gray-600">{filename}</span>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Save</button>
      </div>
    </div>
  );
};

export default ImageSelectorModal;