export interface GetAllBooking {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}

export interface Data {
  perPage: number;
  currentPage: number;
  lastPage: number;
  total: number;
  data: Bookings[];
}

export interface Bookings {
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
  worker: Worker;
  customerReviewList: any[];
}

export interface Worker {
  id: number;
  name: string;
  email: string;
  phone: null;
  address: string;
  avatar: null;
  dateOfBirth: null;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateBookingRes {
  status: boolean;
  code: number;
  message: string;
  data: UpdateBookingResData;
}

export interface UpdateBookingResData {
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
  cancellationReason: string;
  bookingCancellationOrderId: null;
  customerAddressId: number;
  addressDetails: string;
  city: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}
