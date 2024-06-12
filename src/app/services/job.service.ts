import { Injectable } from '@angular/core';
import network from '../config/network.service';
import axios from 'axios';
import { axiosConfiguration } from '../config/network.service';
import { JobPosition } from '../interfaces/job.interface';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import {
  CreateJobPositionDto,
  LanguageSkillDto,
  RequirementDto,
  TechnicalSkillDto,
} from './interfaces/job.dto';
import { Language } from '../interfaces/language.interface';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private axiosInstance = axios.create(axiosConfiguration);

  constructor() {}

  async getCategories() {
    return this.axiosInstance.get('/catalogs/technical-skills-candidate');
  }

  async getTechnicalSkills() {
    return this.axiosInstance.get(`/catalogs/technical-skills-candidate/technical-skill`);
  }

  async getLanguages() {
    return this.axiosInstance.get('/catalogs/language-type');
  }

  async getRecruiterCompanies(recruiterId: string) {
    return this.axiosInstance.get(`/recruiters/${recruiterId}/companies`);
  }

  async createJobPosition(jobPosition: CreateJobPositionDto): Promise<JobPosition> {
    const response = await network.post<JobPosition>(`/job-positions`, jobPosition);

    return response.data;
  }

  async getJobPositionsRecruiter(
    recruiterId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<JobPosition>> {
    const response = await network.get<PaginatedResponse<JobPosition>>(
      `/recruiters/${recruiterId}/job-positions?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async getJobPosition(jobPositionId: string): Promise<JobPosition> {
    const response = await network.get<JobPosition>(`/job-positions/${jobPositionId}`);

    return response.data;
  }

  async updateJobPosition(
    jobPositionId: string,
    jobPosition: CreateJobPositionDto,
  ): Promise<JobPosition> {
    const response = await network.put<JobPosition>(`/job-positions/${jobPositionId}`, jobPosition);

    return response.data;
  }

  async deleteJobPosition(jobPositionId: string): Promise<void> {
    await network.delete(`/job-positions/${jobPositionId}`);
  }

  async updateTechnicalSkills(
    jobPositionId: string,
    technicalSkills: TechnicalSkillDto,
  ): Promise<void> {
    await network.put(`/job-positions/${jobPositionId}/technical-skills`, technicalSkills);
  }

  async updateLanguageSkills(
    jobPositionId: string,
    languageSkills: LanguageSkillDto,
  ): Promise<void> {
    await network.put(`/job-positions/${jobPositionId}/language-skills`, languageSkills);
  }

  async updateRequirements(jobPositionId: string, requirements: RequirementDto): Promise<void> {
    await network.put(`/job-positions/${jobPositionId}/requirements`, requirements);
  }
}
