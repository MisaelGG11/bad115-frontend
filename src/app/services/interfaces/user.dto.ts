export interface PermissionDto {
  name: string;
  description: string;
  codename: string;
}

export interface RoleDto {
  permissions: PermissionDto[];
}
