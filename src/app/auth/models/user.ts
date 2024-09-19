
export interface User {
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
  createdAt:              string;
  updatedAt:              string;
  adminRoleList:          AdminRoleList[];
  accessToken:            string;
}

export interface AdminRoleList {
  id:        number;
  adminId:   number;
  roleId:    number;
  createdAt: string;
  updatedAt: string;
  role:      Role;
}

export interface Role {
  id:                 number;
  nameEn:             string;
  nameEs:             string;
  nameAr:             string;
  createdAt:          string;
  updatedAt:          string;
  rolePermissionList: RolePermissionList[];
}

export interface RolePermissionList {
  id:           number;
  roleId:       number;
  permissionId: number;
  createdAt:    string;
  updatedAt:    string;
  permission:   Permission;
}

export interface Permission {
  id:        number;
  action:    string;
  group:     string;
  createdAt: string;
  updatedAt: string;
}