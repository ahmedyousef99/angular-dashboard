export interface GetAllCancellationBookings {
  status: boolean;
  code: number;
  message: string;
  data: CancellationDetailsData;
}

export interface CancellationDetailsData {
  perPage: number;
  currentPage: number;
  lastPage: number;
  total: number;
  data: cancellationDetails[];
}

export interface cancellationDetails {
  id: number;
  bookingId: number;
  submittedById: number;
  submittedByType: string;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  booking: Booking;
}

export interface Booking {
  id: number;
  serviceId: number;
  customerId: number;
  workerId: number;
  dayKey: string;
  dayDate: Date;
  workingHours: number;
  startingHour: number;
  endingHour: number;
  serviceWorkingTimeId: number;
  servicePrice: string;
  totalPrice: string;
  status: string;
  rejectionReason: null;
  cancellationReason: null;
  bookingCancellationOrderId: null;
  customerAddressId: number;
  addressDetails: string;
  city: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CancellationDetails {
  status: boolean;
  code: number;
  message: string;
  data: CancellationDetailsData;
}

export interface CancellationDetailsData {
  id: number;
  bookingId: number;
  submittedById: number;
  submittedByType: string;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
