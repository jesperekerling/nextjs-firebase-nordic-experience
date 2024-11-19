export interface PackageBooking {
    id: string;
    packageId: string;
    userId: string;
    startDate: string;
    endDate: string;
    guests: number;
    totalPrice: number;
    images: string[];
    days: number;
    price: number;
  }