export interface CustomerList {
    status:  boolean;
    code:    number;
    message: string;
    data:    Data;
}

export interface Data {
    perPage:     number;
    currentPage: number;
    lastPage:    number;
    total:       number;
    data:        Customers[];
}

export interface Customers {
    id:                     number;
    name:                   string;
    email:                  string;
    phone:                  null;
    avatar:                 null;
    dateOfBirth:            null;
    status:                 string;
    isEmailVerified:        boolean;
    isNotificationsEnabled: boolean;
    createdAt:              Date;
    updatedAt:              Date;
}