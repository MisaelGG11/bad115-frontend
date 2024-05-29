import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import network from '../config/network.service';
import { Permission, Role } from '../interfaces/user.interface';
import { PermissionDto, RoleDto } from './interfaces/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  async findPermissionsPaginated({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResponse<Permission>> {
    const permissions = await network.get<PaginatedResponse<Permission>>(
      `/permissions/paginated?page=${page}&perPage=${perPage}`,
    );

    return permissions.data;
  }

  async findPermissions(): Promise<Permission[]> {
    const permissions = await network.get<Permission[]>(`/permissions`);

    return permissions.data;
  }

  async createPermission(permissionDto: PermissionDto): Promise<Permission> {
    const permission = await network.post<Permission>('/permissions', permissionDto);

    return permission.data;
  }

  async findOnePermission(id: string): Promise<Permission> {
    const permission = await network.get<Permission>(`/permissions/${id}`);

    return permission.data;
  }

  async updatePermission(idPermission: string, permissionDto: PermissionDto): Promise<Permission> {
    const permission = await network.put<Permission>(`/permissions/${idPermission}`, permissionDto);

    return permission.data;
  }

  async deletePermission(id: string): Promise<void> {
    await network.delete(`/permissions/${id}`);
  }

  async findRoles({ page, perPage }: PaginationParams): Promise<PaginatedResponse<Role>> {
    const roles = await network.get<PaginatedResponse<Role>>(
      `/roles?page=${page}&perPage=${perPage}`,
    );

    return roles.data;
  }

  async createRole(name: string): Promise<Role> {
    const role = await network.post<Role>('/roles', { name });

    return role.data;
  }

  async findOneRole(id: string): Promise<Role> {
    const role = await network.get<Role>(`/roles/${id}`);

    return role.data;
  }

  async updateRole(idRole: string, permissionIds: string[]): Promise<Role> {
    const role = await network.put<Role>(`/roles/${idRole}/permissions`, { permissionIds });

    return role.data;
  }

  async deleteRole(id: string): Promise<void> {
    await network.delete(`/roles/${id}`);
  }
}
