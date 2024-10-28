export interface Package {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  price: number;
  days: number;
  activities: {
    name: string;
    description: string;
    time: string;
  }[];
  images: string[];
}