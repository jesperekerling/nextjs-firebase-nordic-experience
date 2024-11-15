import { db } from "../../firebase/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import { GeoPoint } from "firebase/firestore";

const addHousingData = async () => {
  const accommodationsCollection = collection(db, "housing");

  const accommodations = [
    {
      name: "Central Apartment Stockholm",
      city: "Stockholm",
      address: "Centralgatan 1, 111 22 Stockholm",
      description: "A cozy apartment in the heart of Stockholm.",
      pricePerNight: 1200,
      images: ["url1", "url2"],
      location: new GeoPoint(59.3293, 18.0686),
      availability: [
        { date: "2023-12-01", available: true },
        { date: "2023-12-02", available: false }
      ]
    },
    // Add more accommodations here
  ];

  const accommodationIds = [];
  for (const accommodation of accommodations) {
    const docRef = await addDoc(accommodationsCollection, accommodation);
    accommodationIds.push(docRef.id);
  }

  const packagesCollection = collection(db, "packages");
  const packages = [
    {
      name: "Stockholm Adventure",
      category: "Adventure",
      city: "Stockholm",
      description: "An exciting adventure in Stockholm.",
      price: 1500,
      days: 3,
      activities: [
        {
          name: "City Tour",
          description: "A guided tour of the city.",
          time: "10:00 AM"
        }
      ],
      images: ["url1", "url2"],
      location: new GeoPoint(59.3293, 18.0686),
      availability: [
        { date: "2023-12-01", tickets: 20 },
        { date: "2023-12-02", tickets: 15 }
      ],
      accommodations: accommodationIds
    },
    // Add more packages here
  ];

  for (const pkg of packages) {
    await addDoc(packagesCollection, pkg);
  }

  console.log("Housing data added successfully!");
};

export default addHousingData;