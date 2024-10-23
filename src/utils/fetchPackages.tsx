import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export async function fetchPackages() {
  const packagesCol = collection(db, "packages");
  const packagesSnapshot = await getDocs(packagesCol);
  const packagesList = packagesSnapshot.docs.map(doc => doc.data());
  return packagesList;
}