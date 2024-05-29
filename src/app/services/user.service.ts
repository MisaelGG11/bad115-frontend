import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import network from '../config/network.service';
import { Permission } from '../interfaces/user.interface';
import { PermissionDto } from './interfaces/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  async findPermissions({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResponse<Permission>> {
    const permissions = await network.get<PaginatedResponse<Permission>>(
      `/permissions?page=${page}&perPage=${perPage}`,
    );

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
}
