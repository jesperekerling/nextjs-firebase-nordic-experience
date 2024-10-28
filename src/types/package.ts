export interface Activity {
    name: string;
    description: string;
    time: string;
  }
  
  export interface Package {
    id: string;
    city: string;
    description: string;
    price: number;
    days: number;
    activities: Activity[];
  }