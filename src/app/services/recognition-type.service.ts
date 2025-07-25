import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import network from '../config/network.service';
import { RecognitionType } from '../interfaces/recognition-type.interface';

@Injectable({
  providedIn: 'root',
})
export class RecognitionTypeService {
  constructor() {}

  async find({ page, perPage }: PaginationParams): Promise<PaginatedResponse<RecognitionType>> {
    const recognitionTypes = await network.get<PaginatedResponse<RecognitionType>>(
      `/catalogs/recognition-types/paginated?page=${page}&perPage=${perPage}`,
    );

    return recognitionTypes.data;
  }

  async create(name: string): Promise<RecognitionType> {
    const recognitionType = await network.post<RecognitionType>('/catalogs/recognition-types', {
      name,
    });

    return recognitionType.data;
  }

  async findOne(id: string): Promise<RecognitionType> {
    const recognitionType = await network.get<RecognitionType>(`/catalogs/recognition-types/${id}`);

    return recognitionType.data;
  }

  async update(id: string, name: string): Promise<RecognitionType> {
    const recognitionType = await network.put<RecognitionType>(
      `/catalogs/recognition-types/${id}`,
      {
        name,
      },
    );

    return recognitionType.data;
  }

  async delete(id: string): Promise<void> {
    await network.delete(`/catalogs/recognition-types/${id}`);
  }
}
