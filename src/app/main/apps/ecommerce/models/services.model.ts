export interface UpdateServiceReq {
  categoryId: number;
  subCategoryId: number;
  price: number;
  yearsOfExperience: number;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionAr: string;
  mainImage: string;
  image: [image: string];
}

export interface ServiceFilters {
  categoryId?: number;
  subCategoryId?: number;
  priceFrom?: number;
  priceTo?: number;
  page?: number;
  limit?: number;
  rate?: number;
  search?: string;
}
export interface getAllServices {
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
  data: DataServiceRes[];
}

export interface DataServiceRes {
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
  category: Category;
  subCategory: null;
  worker: Worker;
  averageRate: number;
  reviewsCount: number;
}

export interface Category {
  id: number;
  parentId: number;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Worker {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  dateOfBirth: string;
  status: string;
  isEmailVerified: boolean;
  isNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
