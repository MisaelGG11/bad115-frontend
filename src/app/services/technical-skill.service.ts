import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import { CatalogTechnicalSkill, TechnicalSkill } from '../interfaces/technical-skill.interface';
import network from '../config/network.service';

@Injectable({
  providedIn: 'root',
})
export class TechnicalSkillService {
  constructor() {}

  async findCatalogPaginated({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResponse<CatalogTechnicalSkill>> {
    const catalogs = await network.get<PaginatedResponse<CatalogTechnicalSkill>>(
      `/catalogs/technical-skills-candidate/paginated?page=${page}&perPage=${perPage}`,
    );

    return catalogs.data;
  }

  async findCatalog(): Promise<CatalogTechnicalSkill[]> {
    const catalogs = await network.get<CatalogTechnicalSkill[]>(
      `/catalogs/technical-skills-candidate`,
    );
    return catalogs.data;
  }

  async findOneCatalog(categoryId: string): Promise<CatalogTechnicalSkill> {
    const catalog = await network.get<CatalogTechnicalSkill>(
      `/catalogs/technical-skills-candidate/category/${categoryId}`,
    );
    return catalog.data;
  }

  async createCatalog(name: string): Promise<CatalogTechnicalSkill> {
    return network.post('/catalogs/technical-skills-candidate/category', {
      name,
    });
  }

  async updateCatalog(id: string, name: string): Promise<CatalogTechnicalSkill> {
    return network.put(`/catalogs/technical-skills-candidate/category/${id}`, {
      name,
    });
  }

  async deleteCatalog(id: string): Promise<void> {
    return network.delete(`/catalogs/technical-skills-candidate/category/${id}`);
  }

  async findOneTechnicalSkill(technicalSkillId: string): Promise<TechnicalSkill> {
    const technicalSkill = await network.get<TechnicalSkill>(
      `/catalogs/technical-skills-candidate/technical-skill/${technicalSkillId}`,
    );

    return technicalSkill.data;
  }

  async findTechnicalSkill(
    { page, perPage }: PaginationParams,
    search?: string,
  ): Promise<PaginatedResponse<TechnicalSkill>> {
    const technicalSkills = await network.get<PaginatedResponse<TechnicalSkill>>(
      `/catalogs/technical-skills-candidate/technical-skills/paginated?page=${page}&perPage=${perPage}&search=${search}`,
    );

    return technicalSkills.data;
  }

  async createTechnicalSkill(categoryId: string, name: string): Promise<TechnicalSkill> {
    return network.post(
      `/catalogs/technical-skills-candidate/technical-skill/category/${categoryId}`,
      {
        name,
      },
    );
  }

  async updateTechnicalSkill(
    technicalSkillId: string,
    name: string,
    categoryTechnicalSkillId: string,
  ): Promise<TechnicalSkill> {
    return network.put(`/catalogs/technical-skills-candidate/technical-skill/${technicalSkillId}`, {
      name,
      categoryTechnicalSkillId,
    });
  }

  async deleteTechnicalSkill(technicalSkillId: string): Promise<void> {
    return network.delete(
      `/catalogs/technical-skills-candidate/technical-skill/${technicalSkillId}`,
    );
  }

  async getTechicalSkillByCategory(categoryId: string): Promise<TechnicalSkill> {
    const catalog = await network.get<TechnicalSkill>(
      `/catalogs/technical-skills-candidate/category/${categoryId}`,
    );
    return catalog.data;
  }

  async findManyByCategoryId(categoryId: string): Promise<CatalogTechnicalSkill> {
    const catalog = await network.get<CatalogTechnicalSkill>(
      `/catalogs/technical-skills-candidate/category/${categoryId}`,
    );
    return catalog.data;
  }
}
