export interface ChangePasswordData{
    status:  boolean;
    code:    number;
    message: string;
    data:    Data;
}

export interface Data {
    id:                     number;
    name:                   string;
    email:                  string;
    status:                 string;
    isNotificationsEnabled: boolean;
    createdAt:              Date;
    updatedAt:              Date;
}