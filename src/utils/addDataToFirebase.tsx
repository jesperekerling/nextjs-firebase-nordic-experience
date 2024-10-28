import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const packages = [
  {
    city: "Stockholm",
    price: 1200,
    description: "Explore the historical sites and enjoy gourmet dinners in Stockholm.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["historical", "gourmet", "sightseeing"],
    activities: [
      {
        name: "Visit the Vasa Museum",
        description: "See the well-preserved 17th-century ship.",
        time: "2 hours"
      },
      {
        name: "Dinner at a Michelin-star restaurant",
        description: "Enjoy a gourmet dinner at one of Stockholm's top restaurants.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Oslo",
    price: 1500,
    description: "Experience the vibrant culture and stunning fjords of Oslo.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 4,
    tags: ["culture", "nature", "adventure"],
    activities: [
      {
        name: "Fjord Cruise",
        description: "Take a scenic cruise through the Oslo fjords.",
        time: "4 hours"
      },
      {
        name: "Visit the Viking Ship Museum",
        description: "Explore the history of the Vikings.",
        time: "2 hours"
      }
    ]
  },
  {
    city: "Helsinki",
    price: 1100,
    description: "Discover the unique architecture and vibrant nightlife of Helsinki.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["architecture", "nightlife", "culture"],
    activities: [
      {
        name: "Visit the Helsinki Cathedral",
        description: "Explore the iconic cathedral in the heart of Helsinki.",
        time: "1 hour"
      },
      {
        name: "Nightlife Tour",
        description: "Experience the vibrant nightlife of Helsinki.",
        time: "4 hours"
      }
    ]
  },
  {
    city: "Copenhagen",
    price: 1300,
    description: "Enjoy the charming streets and world-class dining in Copenhagen.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["charming", "dining", "sightseeing"],
    activities: [
      {
        name: "Visit Tivoli Gardens",
        description: "Enjoy the amusement park and gardens.",
        time: "3 hours"
      },
      {
        name: "Dinner at Noma",
        description: "Dine at one of the world's best restaurants.",
        time: "3 hours"
      }
    ]
  }
];

const addPackagesToFirestore = async () => {
  try {
    const packagesCollection = collection(db, 'packages');
    for (const pkg of packages) {
      await addDoc(packagesCollection, pkg);
    }
    console.log('Packages added successfully');
  } catch (error) {
    console.error('Error adding packages: ', error);
  }
};

export default addPackagesToFirestore;