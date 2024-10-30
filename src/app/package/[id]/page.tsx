import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Package } from "@/types/package";
import PackageDetailClient from './PackageDetailClient';

interface PackageDetailProps {
  params: { id: string };
  searchParams: { user?: string };
}

export async function generateStaticParams() {
  // Fetch all package IDs from Firestore
  const packagesSnapshot = await getDocs(collection(db, 'packages'));
  const paths = packagesSnapshot.docs.map(doc => ({
    id: doc.id,
  }));

  return paths;
}

const PackageDetail = async ({ params }: PackageDetailProps) => {
  const { id } = await params;

  let pkg: Package | null = null;
  let error: string | null = null;

  try {
    const docRef = doc(db, "packages", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      pkg = { id: docSnap.id, ...docSnap.data() } as Package;
    } else {
      error = "Package not found.";
    }
  } catch (err) {
    error = "Failed to fetch package.";
    console.error("Error fetching package:", err);
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {pkg?.images && pkg.images.length > 0 && (
        <>
          <img src={pkg.images[0]} alt="Package Image" className="w-2/3 h-2/3 object-cover mb-4 rounded" />
          {pkg.images.length > 1 && (
            <div className="flex space-x-2 mt-2">
              {pkg.images.slice(1).map((url, index) => (
                <img key={index} src={url} alt={`Thumbnail ${index}`} className="w-1/3 h-1/3 object-cover rounded cursor-pointer" />
              ))}
            </div>
          )}
        </>
      )}
      <h1 className="text-2xl font-bold mb-4">{pkg?.name}</h1>
      <p className="text-gray-500">Category: {pkg?.category}</p>
      <p className="text-gray-500">City: {pkg?.city}</p>
      <p>{pkg?.description}</p>
      <p className="text-gray-500">Price: ${pkg?.price}</p>
      <p className="text-gray-500">Days: {pkg?.days}</p>
      <div className="mt-2">
        <h3 className="font-semibold">Activities:</h3>
        <ul className="list-disc list-inside">
          {pkg?.activities && pkg.activities.length > 0 ? (
            pkg.activities.map((activity, index) => (
              <li key={index}>
                <strong>{activity.name}</strong>: {activity.description} ({activity.time})
              </li>
            ))
          ) : (
            <li>No activities available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PackageDetail;