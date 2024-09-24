export interface CustomerList {
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
  data: Customers[];
}

export interface Customers {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateCustomerReq {
  name: string;
  email: string;
  password: string | number;
  phone: string | number;
  avatar: string;
  dateOfBirth: Date;
  status: string;
}
export interface CreateCustomer {
  status: boolean;
  code: number;
  message: string;
  data: NewCustomer;
}

export interface NewCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
