'use client'
import { useEffect } from 'react';
import addPackagesToFirestore from '../../utils/addDataToFirebase'; // Import as default export

const AddPackages = () => {
  useEffect(() => {
    addPackagesToFirestore();
  }, []);

  return <div>Adding packages to Firestore...</div>;
};

export default AddPackages;