import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import network from '../config/network.service';
import { CategoryTecnicalHabilitie } from '../interfaces/category-tecnical-habilitie.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryTecnicalHabilitieService {
  constructor() {}

  async getCategoryTecnicalHabilities({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResponse<CategoryTecnicalHabilitie>> {
    const categoryTecnicalHabilities = await network.get<PaginatedResponse<CategoryTecnicalHabilitie>>(
      `/catalogs/category-tecnical-habilitie/paginated?page=${page}&perPage=${perPage}`,
    );

    return categoryTecnicalHabilities.data;
  }
}
