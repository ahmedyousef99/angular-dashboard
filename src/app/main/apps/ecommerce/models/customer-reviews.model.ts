export interface GetAllCustomerReviews {
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
  data: Reviews[];
}

export interface Reviews {
  id: number;
  bookingId: number;
  customerId: number;
  workerId: number;
  serviceId: number;
  rate: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: null;
  avatar: null;
  dateOfBirth: null;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
