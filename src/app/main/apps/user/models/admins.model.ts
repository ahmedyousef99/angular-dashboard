export interface AllAdmins {
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
  data: Admin[];
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  status: string;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateAdminReq {
  name: string;
  email: string;
  password: string;
}

export interface CreateAdminRes {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}

export interface Data {
  id: number;
  name: string;
  email: string;
  status: string;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
