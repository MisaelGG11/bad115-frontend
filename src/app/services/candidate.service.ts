import { Injectable } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import {
  LaboralExperience,
  Certification,
  Recognition,
  RecognitionType,
  Publication,
  Participation,
  ParticipationType,
  AcademicKnowledge,
} from '../interfaces/candidate.interface';
import network from '../config/network.service';
import {
  CreateLaborExperienceDto,
  UpdateLaborExperienceDto,
  CreateCertificationDto,
  UpdateCertificationDto,
  CreateRecognitionDto,
  UpdateRecognitionDto,
  CreatePublicationDto,
  UpdatePublicationDto,
  CreateParticipationDto,
  UpdateParticipationDto,
  CreateAcademicKnowledgeDto,
  UpdateAcademicKnowledgeDto,
} from './interfaces/candidate.dto';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor() {}

  // PDF - CV file
  async downloadCV(candidateId: string): Promise<string> {
    const response = await network.post(`/candidates/${candidateId}/pdfs`, {}, { responseType: 'blob' });

    return response.data;
  }

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

  async getCertification(candidateId: string, certificationId: string): Promise<Certification> {
    const response = await network.get<Certification>(
      `/candidates/${candidateId}/certifications/${certificationId}`,
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

  async updateCertification(
    candidateId: string,
    certificationId: string,
    certification: UpdateCertificationDto,
  ): Promise<Certification> {
    const response = await network.put<Certification>(
      `/candidates/${candidateId}/certifications/${certificationId}`,
      certification,
    );

    return response.data;
  }

  async deleteCertification(candidateId: string, certificationId: string): Promise<void> {
    await network.delete(`/candidates/${candidateId}/certifications/${certificationId}`);
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

  async getRecognitionTypes(): Promise<RecognitionType[]> {
    const response = await network.get<RecognitionType[]>(`/catalogs/recognition-types`);

    return response.data;
  }

  async getRecognition(candidateId: string, recognitionId: string): Promise<Recognition> {
    const response = await network.get<Recognition>(
      `/candidates/${candidateId}/recognition/${recognitionId}`,
    );

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

  async updateRecognition(
    candidateId: string,
    recognitionId: string,
    recognition: UpdateRecognitionDto,
  ): Promise<Recognition> {
    const response = await network.put<Recognition>(
      `/candidates/${candidateId}/recognition/${recognitionId}`,
      recognition,
    );

    return response.data;
  }

  async deleteRecognition(candidateId: string, recognitionId: string): Promise<void> {
    await network.delete(`/candidates/${candidateId}/recognition/${recognitionId}`);
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

  async getPublication(candidateId: string, publicationId: string): Promise<Publication> {
    const response = await network.get<Publication>(
      `/candidates/${candidateId}/publication/${publicationId}`,
    );

    return response.data;
  }

  async createPublication(
    candidateId: string,
    publication: CreatePublicationDto,
  ): Promise<Publication> {
    const response = await network.post<Publication>(
      `/candidates/${candidateId}/publication`,
      publication,
    );

    return response.data;
  }

  async updatePublication(
    candidateId: string,
    publicationId: string,
    publication: UpdatePublicationDto,
  ): Promise<Publication> {
    const response = await network.put<Publication>(
      `/candidates/${candidateId}/publication/${publicationId}`,
      publication,
    );

    return response.data;
  }

  async deletePublication(candidateId: string, publicationId: string): Promise<void> {
    await network.delete(`/candidates/${candidateId}/publication/${publicationId}`);
  }

  //Participations
  async getParticipations(
    candidateId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<Participation>> {
    const response = await network.get<PaginatedResponse<Participation>>(
      `/candidates/${candidateId}/participation?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async getParticipationTypes(): Promise<ParticipationType[]> {
    const response = await network.get<ParticipationType[]>(`/catalogs/participation-types`);

    return response.data;
  }

  async getParticipation(candidateId: string, participationId: string): Promise<Participation> {
    const response = await network.get<Participation>(
      `/candidates/${candidateId}/participation/${participationId}`,
    );

    return response.data;
  }

  async createParticipation(
    candidateId: string,
    participation: CreateParticipationDto,
  ): Promise<Participation> {
    const response = await network.post<Participation>(
      `/candidates/${candidateId}/participation`,
      participation,
    );

    return response.data;
  }

  async updateParticipation(
    candidateId: string,
    participationId: string,
    participation: UpdateParticipationDto,
  ): Promise<Participation> {
    const response = await network.put<Participation>(
      `/candidates/${candidateId}/participation/${participationId}`,
      participation,
    );

    return response.data;
  }

  async deleteParticipation(candidateId: string, participationId: string): Promise<void> {
    await network.delete(`/candidates/${candidateId}/participation/${participationId}`);
  }

  // AcademicKnowledge
  async getAcademicKnowledges(
    candidateId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<AcademicKnowledge>> {
    const response = await network.get<PaginatedResponse<AcademicKnowledge>>(
      `/candidates/${candidateId}/academic-knowledge?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async getAcademicKnowledge(
    candidateId: string,
    AcademicKnowledgeId: string,
  ): Promise<AcademicKnowledge> {
    const response = await network.get<AcademicKnowledge>(
      `/candidates/${candidateId}/academic-knowledge/${AcademicKnowledgeId}`,
    );

    return response.data;
  }

  async createAcademicKnowledgeDto(
    candidateId: string,
    AcademicKnowledge: CreateAcademicKnowledgeDto,
  ): Promise<AcademicKnowledge> {
    const response = await network.post<AcademicKnowledge>(
      `/candidates/${candidateId}/academic-knowledge`,
      AcademicKnowledge,
    );

    return response.data;
  }

  async updateAcademicKnowledgeDto(
    candidateId: string,
    AcademicKnowledgeId: string,
    AcademicKnowledge: UpdateAcademicKnowledgeDto,
  ): Promise<AcademicKnowledge> {
    const response = await network.put<AcademicKnowledge>(
      `/candidates/${candidateId}/academic-knowledge/${AcademicKnowledgeId}`,
      AcademicKnowledge,
    );

    return response.data;
  }

  async deleteAcademicKnowledge(candidateId: string, AcademicKnowledgeId: string): Promise<void> {
    await network.delete(`/candidates/${candidateId}/academic-knowledge/${AcademicKnowledgeId}`);
  }
}
