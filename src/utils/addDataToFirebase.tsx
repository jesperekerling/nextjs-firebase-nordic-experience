import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const packages = [
  {
    city: "Stockholm",
    name: "Historical trip to Stockholm",
    category: "Historical",
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
    city: "Stockholm",
    name: "Modern Art in Stockholm",
    category: "Art",
    price: 1100,
    description: "Discover modern art and contemporary culture in Stockholm.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 2,
    tags: ["art", "culture", "modern"],
    activities: [
      {
        name: "Visit Moderna Museet",
        description: "Explore contemporary art at Moderna Museet.",
        time: "3 hours"
      },
      {
        name: "City Walk",
        description: "Enjoy a guided walk through the modern parts of Stockholm.",
        time: "2 hours"
      }
    ]
  },
  {
    city: "Stockholm",
    name: "Family Fun in Stockholm",
    category: "Family",
    price: 1300,
    description: "Enjoy family-friendly activities and attractions in Stockholm.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["family", "fun", "attractions"],
    activities: [
      {
        name: "Visit Skansen",
        description: "Explore the open-air museum and zoo.",
        time: "4 hours"
      },
      {
        name: "Boat Tour",
        description: "Take a boat tour around the Stockholm archipelago.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Oslo",
    name: "Cultural and Fjord Adventure in Oslo",
    category: "Adventure",
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
    city: "Oslo",
    name: "Historical Oslo",
    category: "Historical",
    price: 1400,
    description: "Discover the rich history and heritage of Oslo.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["history", "heritage", "culture"],
    activities: [
      {
        name: "Visit Akershus Fortress",
        description: "Explore the medieval fortress and castle.",
        time: "3 hours"
      },
      {
        name: "Historical City Tour",
        description: "Take a guided tour through Oslo's historical sites.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Oslo",
    name: "Nature and Adventure in Oslo",
    category: "Nature",
    price: 1600,
    description: "Enjoy outdoor activities and natural beauty in Oslo.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 4,
    tags: ["nature", "adventure", "outdoors"],
    activities: [
      {
        name: "Hiking in Nordmarka",
        description: "Go for a hike in the beautiful Nordmarka forest.",
        time: "5 hours"
      },
      {
        name: "Kayaking on the Oslo Fjord",
        description: "Experience kayaking on the scenic Oslo Fjord.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Helsinki",
    name: "Vibrant Helsinki Getaway",
    category: "Nightlife",
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
    city: "Helsinki",
    name: "Cultural Helsinki",
    category: "Culture",
    price: 1200,
    description: "Immerse yourself in the rich culture and history of Helsinki.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["culture", "history", "sightseeing"],
    activities: [
      {
        name: "Visit the National Museum of Finland",
        description: "Learn about Finnish history and culture.",
        time: "3 hours"
      },
      {
        name: "City Sightseeing Tour",
        description: "Take a guided tour of Helsinki's cultural landmarks.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Helsinki",
    name: "Nature and Relaxation in Helsinki",
    category: "Nature",
    price: 1300,
    description: "Enjoy the natural beauty and relaxation opportunities in Helsinki.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["nature", "relaxation", "outdoors"],
    activities: [
      {
        name: "Visit Nuuksio National Park",
        description: "Explore the beautiful national park near Helsinki.",
        time: "5 hours"
      },
      {
        name: "Relax at Allas Sea Pool",
        description: "Enjoy the outdoor swimming pools and saunas.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Copenhagen",
    name: "Charming Copenhagen Experience",
    category: "Charming",
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
  },
  {
    city: "Copenhagen",
    name: "Historical Copenhagen",
    category: "Historical",
    price: 1200,
    description: "Explore the historical sites and cultural heritage of Copenhagen.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["historical", "culture", "sightseeing"],
    activities: [
      {
        name: "Visit Rosenborg Castle",
        description: "Explore the historic castle and its gardens.",
        time: "2 hours"
      },
      {
        name: "City Walking Tour",
        description: "Take a guided walking tour through Copenhagen's historical sites.",
        time: "3 hours"
      }
    ]
  },
  {
    city: "Copenhagen",
    name: "Family Fun in Copenhagen",
    category: "Family",
    price: 1400,
    description: "Enjoy family-friendly activities and attractions in Copenhagen.",
    images: [
      "url_to_image1.jpg",
      "url_to_image2.jpg"
    ],
    days: 3,
    tags: ["family", "fun", "attractions"],
    activities: [
      {
        name: "Visit Copenhagen Zoo",
        description: "Explore the zoo and see a variety of animals.",
        time: "4 hours"
      },
      {
        name: "Boat Tour",
        description: "Take a boat tour through the canals of Copenhagen.",
        time: "3 hours"
      }
    ]
  }
];

const addDataToFirebase = async () => {
  try {
    const collectionRef = collection(db, "packages");
    for (const pkg of packages) {
      await addDoc(collectionRef, pkg);
    }
    console.log("Data added successfully");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

addDataToFirebase();