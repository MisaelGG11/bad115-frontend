import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import { CatalogTechnicalSkill, TechnicalSkill } from '../interfaces/technical-skill.interface';
import network from '../config/network.service';

@Injectable({
  providedIn: 'root',
})
export class TechnicalSkillService {
  constructor() {}

  async findCatalog({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResponse<CatalogTechnicalSkill>> {
    const catalogs = await network.get<PaginatedResponse<CatalogTechnicalSkill>>(
      `/catalogs/technical-skills-candidate/paginated?page=${page}&perPage=${perPage}`,
    );

    return catalogs.data;
  }

  async create(name: string): Promise<CatalogTechnicalSkill> {
    return network.post('/catalogs/technical-skills-candidate/category', {
      name,
    });
  }

  async update(id: string, name: string): Promise<CatalogTechnicalSkill> {
    return network.put(`/catalogs/technical-skills-candidate/category/${id}`, {
      name,
    });
  }

  async delete(id: string): Promise<void> {
    return network.delete(`/catalogs/technical-skills-candidate/category/${id}`);
  }

  async findTechnicalSkill({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResponse<TechnicalSkill>> {
    const technicalSkills = await network.get<PaginatedResponse<TechnicalSkill>>(
      `/catalogs/technical-skills-candidate/technical-skills/paginated?page=${page}&perPage=${perPage}`,
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

  async updateTechnicalSkill(technicalSkillId: string, name: string): Promise<TechnicalSkill> {
    return network.put(`/catalogs/technical-skills-candidate/technical-skill/${technicalSkillId}`, {
      name,
    });
  }

  async deleteTechnicalSkill(technicalSkillId: string): Promise<void> {
    return network.delete(
      `/catalogs/technical-skills-candidate/technical-skill/${technicalSkillId}`,
    );
  }
}
