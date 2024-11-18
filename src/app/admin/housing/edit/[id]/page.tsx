'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../../../firebase/firebaseConfig"; // Adjust the import path
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { Housing } from "@/types/housing";
import ImageSelectorModal from "@/components/ImageSelectorModal";
import Link from 'next/link';
import Image from 'next/image';
import { GeoPoint } from "firebase/firestore";

const EditHousingPage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed

  const [housing, setHousing] = useState<Housing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHousing = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "housing", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHousing(docSnap.data() as Housing);
        } else {
          setError("Housing not found.");
        }
      } catch (error) {
        setError("Failed to fetch housing.");
        console.error("Error fetching housing:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, 'housing-images/');
        const imagesList = await listAll(imagesRef);
        const urls = await Promise.all(imagesList.items.map(item => getDownloadURL(item)));
        setImageList(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchHousing();
    fetchImages();
  }, [id]);

  const handleUpdateHousing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!housing) return;
    setLoading(true);

    try {
      const docRef = doc(db, "housing", housing.id);
      await updateDoc(docRef, {
        ...housing,
        location: new GeoPoint(housing.location.latitude, housing.location.longitude)
      });
      router.push('/admin/housing');
    } catch (error) {
      setError("Failed to update housing.");
      console.error("Error updating housing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHousing(prevHousing => prevHousing ? { ...prevHousing, [name]: value } : null);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedLocation = {
        latitude: prevHousing.location.latitude,
        longitude: prevHousing.location.longitude,
        [name]: parseFloat(value)
      };
      return { ...prevHousing, location: new GeoPoint(updatedLocation.latitude, updatedLocation.longitude) };
    });
  };

  const handleImageSelect = (url: string) => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      if (selectedImageIndex !== null) {
        const updatedImages = [...(prevHousing.images || [])];
        updatedImages[selectedImageIndex] = url;
        return { ...prevHousing, images: updatedImages };
      }
      return prevHousing;
    });
    setIsModalOpen(false);
  };

  const handleOpenModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedImages = [...(prevHousing.images || []), ""];
      return { ...prevHousing, images: updatedImages };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!newImage) return;

    const storageRef = ref(storage, `housing-images/${newImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newImage);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setHousing(prevHousing => {
            if (!prevHousing) return null;
            const updatedImages = [...(prevHousing.images || []), downloadURL];
            return { ...prevHousing, images: updatedImages };
          });
          alert('Upload successful!');
        });
      }
    );
  };

  const handleDeleteImage = (index: number) => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedImages = prevHousing.images.filter((_, i) => i !== index);
      return { ...prevHousing, images: updatedImages };
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Housing</h1>
      <p className='pb-10'>
        <Link href="/admin/housing">
          Back to housing list
        </Link>
      </p>
      <form onSubmit={handleUpdateHousing} className="flex flex-col gap-4">
        <label className="font-bold">Name</label>
        <input
          type="text"
          name="name"
          value={housing?.name || ''}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <label className="mt-4 font-bold">City</label>
        <input
          type="text"
          name="city"
          value={housing?.city || ''}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <label className="mt-4 font-bold">Address</label>
        <input
          type="text"
          name="address"
          value={housing?.address || ''}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <label className="mt-4 font-bold">Description</label>
        <textarea
          name="description"
          value={housing?.description || ''}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <label className="mt-4 font-bold">Price Per Night</label>
        <input
          type="number"
          name="pricePerNight"
          value={housing?.pricePerNight || 0}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <label className="mt-4 font-bold">Max Guests</label>
        <input
          type="number"
          name="maxGuests"
          value={housing?.maxGuests || 1}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <div className="mt-4">
          <h3 className="font-semibold">Location:</h3>
          <input
            type="number"
            name="latitude"
            value={housing?.location.latitude || 0}
            onChange={handleLocationChange}
            className="p-2 border border-gray-300 rounded mb-2"
            placeholder="Latitude"
          />
          <input
            type="number"
            name="longitude"
            value={housing?.location.longitude || 0}
            onChange={handleLocationChange}
            className="p-2 border border-gray-300 rounded mb-2"
            placeholder="Longitude"
          />
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Images:</h3>
          {housing?.images.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={url}
                readOnly
                className="p-2 border border-gray-300 rounded flex-1"
              />
              <Image
                src={url}
                alt={`Image ${index}`}
                width={64}
                height={64}
                className="w-16 h-16 object-cover"
              />
              <button
                type="button"
                onClick={() => handleOpenModal(index)}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="p-2 bg-green-500 text-white rounded mt-2"
          >
            Add New Image
          </button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Upload New Image:</h3>
          <input type="file" onChange={handleImageChange} />
          <button type="button" onClick={handleUpload} className="p-2 bg-green-500 text-white rounded mt-2">Upload</button>
          <progress value={uploadProgress} max="100" className="w-full mt-2" />
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
      </form>
      <ImageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        folderPath="housing-images/"
        onSelectImage={handleImageSelect}
        imageList={imageList} // Pass the imageList prop
      />
    </div>
  );
};

export default EditHousingPage;