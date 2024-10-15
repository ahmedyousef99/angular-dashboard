export interface AllWorkers {
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
  data: worker[];
}

export interface worker {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: null;
  dateOfBirth: Date;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateWorkersRes {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}

export interface Data {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: null;
  dateOfBirth: Date;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateWorkerReq {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  dateOfBirth: Date;
  status: string;
  address: string;
}
