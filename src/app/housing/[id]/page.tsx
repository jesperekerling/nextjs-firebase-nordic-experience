import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";
import HousingDetailClient from "./HousingDetailClient";
import Link from "next/link";
import GoogleMaps from "@/components/GoogleMaps";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docRef = doc(db, "housing", id);
  const docSnap = await getDoc(docRef);
  const housing = docSnap.exists() ? (docSnap.data() as Housing) : null;

  return {
    title: housing ? `${housing.name} - Nordic Experiences` : "Housing not found - Nordic Experiences",
    description: housing ? housing.description : "Housing not found",
  };
}

const HousingDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let housing: Housing | null = null;
  let error: string | null = null;

  try {
    const docRef = doc(db, "housing", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      housing = {
        ...data,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        },
      } as Housing;
    } else {
      error = "Housing not found.";
    }
  } catch (err) {
    error = "Failed to fetch housing.";
    console.error("Error fetching housing:", err);
  }

  if (error) {
    return <div>{error}</div>;
  }

  const defaultLat = 55.672112;
  const defaultLng = 12.521130;
  const location = housing?.location;

  const lat = location?.latitude || defaultLat;
  const lng = location?.longitude || defaultLng;

  return (
    <div>
      <Link href="/housing">
        <button className="bg-primary text-white py-2 px-3 rounded-lg font-semibold text-sm md:text-md hover:opacity-80">
          Back to housing list
        </button>
      </Link>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-7 md:my-10">{housing?.name}</h1>
      {housing?.images && housing.images.length > 0 && <HousingDetailClient housing={housing} lat={lat} lng={lng} />}
      <p className="mt-5">
        <button className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80">
          Book now
        </button>
      </p>
      <div className="my-7 md:my-5 md:flex text-center">
        <span className="bg-secondary text-black py-3 px-5 rounded-lg font-semibold">{housing?.city}</span>
        <span className="bg-secondary text-black py-3 px-5 mx-4 rounded-lg font-semibold">Up to {housing?.maxGuests} guests</span>
        <p className="text-black block mt-7 md:mt-auto flex-auto text-center md:text-right font-semibold px-1 m-2 text-lg">${housing?.pricePerNight} per night</p>
      </div>
      
      <p className="text-md md:text-lg flex-auto pb-5">{housing?.description}</p>
      
      <h2 className="text-xl md:text-2xl font-bold mt-7 md:mt-10 mb-5">Location</h2>
      <p className="pb-5">{housing?.address}</p>
      <GoogleMaps lat={lat} lng={lng} />
    </div>
  );
};

export default HousingDetailPage;