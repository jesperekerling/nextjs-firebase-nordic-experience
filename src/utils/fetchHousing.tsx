import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";

export const fetchHousing = async (): Promise<Housing[]> => {
  const housingSnapshot = await getDocs(collection(db, 'housing'));
  const housingList: Housing[] = housingSnapshot.docs.map(doc => {
    const data = doc.data();
    const location = data.location;
    const lat = location ? location.latitude : null;
    const lng = location ? location.longitude : null;

    return {
      ...data,
      id: doc.id,
      location: { latitude: lat, longitude: lng },
    } as Housing;
  });

  return housingList;
};