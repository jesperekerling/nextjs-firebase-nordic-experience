import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Package } from "../types/package";

export async function fetchPackages(): Promise<Package[]> {
  try {
    const packagesCol = collection(db, "packages");
    const packagesSnapshot = await getDocs(packagesCol);
    const packagesList = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Package[];
    console.log("Fetched packages:", packagesList); // Add this line to log the fetched packages
    return packagesList;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
}