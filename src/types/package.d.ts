import { GeoPoint } from "firebase/firestore";

export interface Package {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  price: number;
  days: number;
  address: string;
  activities: {
    name: string;
    description: string;
    time: string;
  }[];
  images: string[];
  location: GeoPoint;
  availability: {
    date: string;
    tickets: number;
  }[];
  accommodations: string[]; // Array of accommodation IDs
}