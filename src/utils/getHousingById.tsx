import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";

export async function getHousingById(id: string): Promise<Housing | null> {
  const docRef = doc(db, "housing", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Housing;
  } else {
    return null;
  }
}