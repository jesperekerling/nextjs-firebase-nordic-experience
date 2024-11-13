import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Package } from "@/types/package";

export const fetchPackages = async (): Promise<Package[]> => {
  const packagesSnapshot = await getDocs(collection(db, 'packages'));
  const packages: Package[] = packagesSnapshot.docs.map(doc => {
    const data = doc.data();
    const location = data.location;
    const lat = location ? location.latitude : null;
    const lng = location ? location.longitude : null;

    return {
      ...data,
      id: doc.id,
      location: { latitude: lat, longitude: lng },
    } as Package;
  });

  return packages;
};