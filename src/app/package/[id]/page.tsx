import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Package } from "@/types/package";
import PackageDetailClient from './PackageDetailClient';
import Link from "next/link";

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
  const resolvedParams = await params;
  const { id } = resolvedParams;

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
    <div>
      <Link href="/">
        <button className="bg-primary text-white py-2 px-3 rounded-lg font-semibold text-sm md:text-md">
          Back go packages
        </button>
      </Link>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-10">{pkg?.name}</h1>
      {pkg?.images && pkg.images.length > 0 && (
        <PackageDetailClient images={pkg.images} />
      )}
      <div className="flex py-5">
        <p className="text-md md:text-lg flex-auto">
          {pkg?.description}
        </p>
        <p className="text-black flex-auto text-right font-bold px-1">
          ${pkg?.price} per person
        </p>
      </div>
      <p className="my-5">
        <span className="bg-primary text-white py-3 px-5 rounded-lg font-semibold">{pkg?.city}</span>
        <span className="bg-secondary py-3 px-5 mx-4 rounded-lg font-semibold">{pkg?.category}</span>
        <span className="bg-secondary py-3 px-5 rounded-lg my-5 font-semibold">{pkg?.days} days</span>
      </p>
      <div className="mt-2">
        <h3 className="font-semibold pt-5 pb-3">Activities</h3>
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