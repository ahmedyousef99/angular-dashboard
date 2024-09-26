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
  subCategoryList?: Category[];
}
