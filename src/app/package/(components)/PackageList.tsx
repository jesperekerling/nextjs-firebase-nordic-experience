import { fetchPackages } from "../../../utils/fetchPackages";
// import { Package } from "../types/package";
import Link from "next/link";

const PackageList = async () => {
  // const [packages, setPackages] = useState<Package[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   getPackages();
  // }, []);

  const packages = await fetchPackages();
  // const getPackages = async () => {
  //   try {
  //     setPackages(packagesData);
  //     console.log("Packages state:", packagesData);
  //   } catch (error) {
  //     setError("Failed to fetch packages.");
  //     console.error("Error fetching packages:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {packages && packages.length > 0 ? (
        packages.map(pkg => (
          <Link href={`/package/${pkg.id}`} key={pkg.id}>
            <div className="border p-4 rounded shadow">
              {pkg.images && pkg.images.length > 0 && (
                <img src={pkg.images[0]} alt={`Image for ${pkg.name}`} className="hover:opacity-90 w-full h-48 object-cover mt-2 rounded" />
              )}
              <h2 className="text-xl font-bold py-3">{pkg.name}</h2>
              <p className="text-gray-500">Category: {pkg.category}</p>
              <p className="text-gray-500">City: {pkg.city}</p>
              <p>{pkg.description}</p>
              <p className="text-gray-500">Price: ${pkg.price}</p>
              <p className="text-gray-500">Days: {pkg.days}</p>
              <div className="mt-2">
                <h3 className="font-semibold">Activities:</h3>
                <ul className="list-disc list-inside">
                  {pkg.activities && pkg.activities.length > 0 ? (
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
          </Link>
        ))
      ) : (
        <div>No packages available.</div>
      )}
    </div>
  );
};

export default PackageList;