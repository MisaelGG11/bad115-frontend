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
}
