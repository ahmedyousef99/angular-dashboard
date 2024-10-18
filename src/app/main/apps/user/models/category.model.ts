export interface AllCategories {
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
  data: Category[];
}

export interface Category {
  id: number;
  parentId: number | null;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  treeStatus: string;
  subCategoryList?: Category[];
}

export interface DeleteCategory {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}

export interface Data {
  parentId: null;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface newCategoryReq {
  parentId?: number;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  image: any;
}

export interface CategoryDetails {
  status: boolean;
  code: number;
  message: string;
  data: DataDetails;
}

export interface DataDetails {
  id: number;
  parentId: number | null;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subCategoryList?: Data[];
}
