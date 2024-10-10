export interface ServicesDetails {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}

export interface Data {
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
  subCategory: string;
  worker: Worker;
  serviceImageList: ServiceImageList[];
  serviceWorkingTimeList: ServiceWorkingTimeList[];
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

export interface ServiceImageList {
  id: number;
  serviceId: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceWorkingTimeList {
  id: number;
  serviceId: number;
  dayKey: string;
  startingHour: number;
  endingHour: number;
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

export interface UpdateServiceBody {
  categoryId: number;
  subCategoryId: number;
  price: number;
  yearsOfExperience: number;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionAr: string;
  mainImage: string;
  images: string[];
  serviceWorkingTimeList: {
    id: number;
    dayKey: string;
    startingHour: number;
    endingHour: number;
  }[];
  deletedServiceWorkingTimeIdsList: number[];
  deletedServiceImagesIdsList: number[];
}
