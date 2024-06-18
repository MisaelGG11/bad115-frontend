import { Injectable } from '@angular/core';
import network from '../config/network.service';
import axios from 'axios';
import { axiosConfiguration } from '../config/network.service';
import { JobApplicationCandidate, JobPosition, Meeting } from '../interfaces/job.interface';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import {
  CreateJobApplicationDto,
  CreateJobPositionDto,
  CreateMeetingDto,
  JobApplication,
  LanguageSkillDto,
  RequirementDto,
  TechnicalSkillDto,
  updateJobApplicationDto,
} from './interfaces/job.dto';

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

  async getCompanyCatalog() {
    return this.axiosInstance.get(`/companies/without-paginated`);
  }

  async createJobPosition(jobPosition: CreateJobPositionDto): Promise<JobPosition> {
    const response = await network.post<JobPosition>(`/job-positions`, jobPosition);

    return response.data;
  }

  async getAllJobPositions(
    { perPage = 10, page = 1 }: PaginationParams,
    filters: any,
  ): Promise<PaginatedResponse<JobPosition>> {
    const response = await network.get<PaginatedResponse<JobPosition>>(`/job-positions`, {
      params: {
        page,
        perPage,
        ...filters,
      },
    });

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

  async createJobApplication(createJobApplicationDto: CreateJobApplicationDto) {
    const { jobPositionId, mimeTypeFile, candidateId } = createJobApplicationDto;

    const response = await network.post<JobApplication>(
      `/job-applications/candidate/${candidateId}/job-position/${jobPositionId}`,
      {
        mimeTypeFile,
        status: 'Aplicada',
      },
    );

    return response;
  }

  async getApplicationsByJobPosition(
    jobPositionId: string,
    { page, perPage }: PaginationParams,
    filters: any,
  ): Promise<PaginatedResponse<JobApplicationCandidate>> {
    const applications = await network.get<PaginatedResponse<JobApplicationCandidate>>(
      `/job-positions/${jobPositionId}/job-applications`,
      {
        params: {
          page,
          perPage,
          ...filters,
        },
      },
    );

    return applications.data;
  }

  async getApplicationsByCandidate(
    candidateId: string,
    { page, perPage }: PaginationParams,
  ): Promise<PaginatedResponse<JobApplicationCandidate>> {
    const applications = await network.get<PaginatedResponse<JobApplicationCandidate>>(
      `/candidates/${candidateId}/job-applications`,
      {
        params: {
          page,
          perPage,
        },
      },
    );

    return applications.data;
  }

  async getJobApplication(jobApplicationId: string): Promise<JobApplicationCandidate> {
    const application = await network.get<JobApplicationCandidate>(
      `/job-applications/${jobApplicationId}`,
    );

    return application.data;
  }

  async createMeeting(jobApplicationId: string, meeting: CreateMeetingDto): Promise<Meeting> {
    const response = await network.post<Meeting>(
      `/recruiter/meeting/jobAplication/${jobApplicationId}`,
      meeting,
    );

    return response.data;
  }

  async updateJobApplication(
    jobApplicationId: string,
    jobApplication: updateJobApplicationDto,
  ): Promise<JobApplication> {
    const response = await network.put<JobApplication>(`/job-applications/${jobApplicationId}`, {
      ...jobApplication,
      recomendation: jobApplication?.recomendation || undefined,
    });

    return response.data;
  }
}
