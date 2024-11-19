export interface Booking {
    id: string;
    housingId: string;
    userId: string;
    startDate: string;
    endDate: string;
    guests: number;
    totalPrice: number;
}