export interface AllFaqs {
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
  data: Faq[];
}

export interface Faq {
  id: number;
  userType: UserType;
  questionEn: string;
  questionEs: Date;
  questionAr: Date;
  answerEn: string;
  answerEs: string;
  answerAr: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserType {
  userType: "CUSTOMER" | "WORKER";
}
export interface DeleteFaq {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}

export interface Data {
  userType: string;
  questionEn: string;
  questionEs: string;
  questionAr: string;
  answerEn: string;
  answerEs: string;
  answerAr: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFaqReq {
  userType: string;
  questionEn: string;
  questionEs: string;
  questionAr: string;
  answerEn: string;
  answerEs: string;
  answerAr: string;
}
