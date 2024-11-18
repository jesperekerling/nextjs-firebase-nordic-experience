'use client';
import React, { useState, useEffect } from 'react';
import { storage } from '../../../../firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';

function AddContent() {
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [folder, setFolder] = useState<string>('images');

  const fetchImages = useCallback(async () => {
    const imagesRef = ref(storage, `${folder}/`);
    const imagesList = await listAll(imagesRef);
    const urls = await Promise.all(imagesList.items.map(item => getDownloadURL(item)));
    setImageList(urls);
  }, [folder]);

  useEffect(() => {
    fetchImages();
  }, [folder, fetchImages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `${folder}/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload failed', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          alert('Upload successful!');
          fetchImages(); // Refresh the image list after upload
        });
      }
    );
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFolder(e.target.value);
  };

  return (
    <div>
      <p>
        <Link href="/admin/" className="hover:underline bg-primary text-white rounded px-4 py-3">Back to Admin</Link>
      </p>
      <h1 className='text-2xl py-3 font-bold mt-5'>Upload Image</h1>
      <div className="mb-4">
        <label className="mr-2">Select Folder:</label>
        <select value={folder} onChange={handleFolderChange} className="p-2 border border-gray-300 rounded">
          <option value="images">Images</option>
          <option value="housing-images">Housing Images</option>
        </select>
      </div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} className="bg-primary text-white px-3 py-2 rounded-lg mr-3">Upload</button>
      <progress value={progress} max="100" />
      {imageUrl && <Image src={imageUrl} alt="Uploaded" width={100} height={100} />}
      <h2 className='pt-10 pb-3'>All Images</h2>
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
                style={{ cursor: 'pointer' }}
              />
              <span className="mt-2 text-sm text-gray-600">{filename}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AddContent;