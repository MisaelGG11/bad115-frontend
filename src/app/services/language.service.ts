import { Injectable } from '@angular/core';
import network from '../config/network.service';
import { Language } from '../interfaces/language.interface';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {}

  async find({ page, perPage }: PaginationParams): Promise<PaginatedResponse<Language>> {
    const languages = await network.get<PaginatedResponse<Language>>(
      `/catalogs/language-type/paginated?page=${page}&perPage=${perPage}`,
    );

    console.log({ languages });
    return languages.data;
  }

  async findOne(id: string): Promise<Language> {
    const language = await network.get<Language>(`/catalogs/language-type/${id}`);
    return language.data;
  }

  async create(name: string): Promise<Language> {
    return network.post('/catalogs/language-type', {
      language: name,
    });
  }

  async update(id: string, name: string): Promise<Language> {
    return network.put(`/catalogs/language-type/${id}`, {
      language: name,
    });
  }

  async delete(id: string): Promise<void> {
    return network.delete(`/catalogs/language-type/${id}`);
  }
}
