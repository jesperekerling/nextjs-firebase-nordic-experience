'use client'
import { useEffect } from 'react';
import addPackagesToFirestore from './../../utils/addDataToFirebase';

const AddPackages = () => {
  useEffect(() => {
    addPackagesToFirestore();
  }, []);

  return <div>Adding packages to Firestore...</div>;
};

export default AddPackages;