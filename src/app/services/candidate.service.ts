import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import { LaboralExperience } from '../interfaces/candidate.interface';
import network from '../config/network.service';
import { CreateLaborExperience, UpdateLaborExperience } from './interfaces/candidate.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor() {}

  async getLaborExperiences(
    candidateId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<LaboralExperience>> {
    const response = await network.get<PaginatedResponse<LaboralExperience>>(
      `/candidates/${candidateId}/laboral-experiences?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async getLaborExperience(
    candidateId: string,
    laborExperienceId: string,
  ): Promise<LaboralExperience> {
    const response = await network.get<LaboralExperience>(
      `/candidates/${candidateId}/laboral-experiences/${laborExperienceId}`,
    );

    return response.data;
  }

  async createLaborExperience(
    candidateId: string,
    laborExperience: CreateLaborExperience,
  ): Promise<LaboralExperience> {
    const response = await network.post<LaboralExperience>(
      `/candidates/${candidateId}/laboral-experiences`,
      laborExperience,
    );

    return response.data;
  }

  async updateLaborExperience(
    candidateId: string,
    laborExperienceId: string,
    laborExperience: UpdateLaborExperience,
  ): Promise<LaboralExperience> {
    const response = await network.put<LaboralExperience>(
      `/candidates/${candidateId}/laboral-experiences/${laborExperienceId}`,
      laborExperience,
    );

    return response.data;
  }

  async deleteLaborExperience(candidateId: string, laborExperienceId: string): Promise<void> {
    await network.delete(`/candidates/${candidateId}/laboral-experiences/${laborExperienceId}`);
  }
}
