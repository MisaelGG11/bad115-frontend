import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import {
  LaboralExperience,
  Certification,
  Recognition,
  RecognitionTypeCatalog,
  Publication,
} from '../interfaces/candidate.interface';
import network from '../config/network.service';
import {
  CreateLaborExperienceDto,
  UpdateLaborExperienceDto,
  CreateCertificationDto,
  CreateRecognitionDto,
  CreatePublicationDto,
} from './interfaces/candidate.dto';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor() {}

  // Labor Experience
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
    laborExperience: CreateLaborExperienceDto,
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
    laborExperience: UpdateLaborExperienceDto,
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

  // Certifications
  async getCertifications(
    candidateId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<Certification>> {
    const response = await network.get<PaginatedResponse<Certification>>(
      `/candidates/${candidateId}/certifications?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async createCertification(
    candidateId: string,
    certification: CreateCertificationDto,
  ): Promise<Certification> {
    const response = await network.post<Certification>(
      `/candidates/${candidateId}/certifications`,
      certification,
    );

    return response.data;
  }

  // Recognitions
  async getRecognitions(
    candidateId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<Recognition>> {
    const response = await network.get<PaginatedResponse<Recognition>>(
      `/candidates/${candidateId}/recognition?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async getRecognitionTypes(): Promise<RecognitionTypeCatalog[]> {
    const response = await network.get<RecognitionTypeCatalog[]>(`/catalogs/recognition-types`);

    return response.data;
  }

  async createRecognition(
    candidateId: string,
    recognition: CreateRecognitionDto,
  ): Promise<Recognition> {
    const response = await network.post<Recognition>(
      `/candidates/${candidateId}/recognition`,
      recognition,
    );

    return response.data;
  }

  // Publications
  async getPublications(
    candidateId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<Publication>> {
    const response = await network.get<PaginatedResponse<Publication>>(
      `/candidates/${candidateId}/publication?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async createPublication(
    candidateId: string,
    publications: CreatePublicationDto,
  ): Promise<Publication> {
    const response = await network.post<Publication>(
      `/candidates/${candidateId}/publication`,
      publications,
    );

    return response.data;
  }
}
