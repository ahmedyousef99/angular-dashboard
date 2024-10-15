export interface getBookingDetails {
  status: boolean;
  code: number;
  message: string;
  data: getBookingDetailsData;
}

export interface getBookingDetailsData {
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
  service: Service;
  customer: Customer;
  worker: Customer;
  bookingCancellationOrder: null;
  customerReviewList: any[];
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
  address?: string;
}

export interface Service {
  id: number;
  categoryId: number;
  subCategoryId: number;
  workerId: number;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  price: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionAr: string;
  mainImage: string;
  yearsOfExperience: number;
  createdAt: Date;
  updatedAt: Date;
}
