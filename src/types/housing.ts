import { GeoPoint } from "firebase/firestore";

export interface Accommodation {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  pricePerNight: number;
  images: string[];
  location: GeoPoint;
  availability: {
    date: string;
    available: boolean;
  }[];
}