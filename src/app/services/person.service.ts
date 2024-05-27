import { Injectable } from '@angular/core';
import network from '../config/network.service';
import { Person, SocialMedia, SocialMediaType } from '../interfaces/person.interface';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import {
  CreateAddressDto,
  UpdatePersonDto,
  UpsertDocumentDto,
  CreateSocialMediaDto,
  UpdateSocialMediaDto,
} from './interfaces/person.dto';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor() {}

  async getPeople(): Promise<PaginatedResponse<Person>> {
    const response = await network.post<PaginatedResponse<Person>>('/persons');

    return response.data;
  }

  async getPerson(personId: string) {
    return network.get<Person>(`/persons/${personId}`);
  }

  async update(updatePersonDto: UpdatePersonDto) {
    return network.put<Person>(`/persons/${updatePersonDto.id}`, updatePersonDto);
  }

  async addAddress(personId: string, createAddressDto: CreateAddressDto) {
    return network.post(`/persons/${personId}/addresses`, createAddressDto);
  }

  async upsertDocument(personId: string, upsertDocumentDto: UpsertDocumentDto) {
    return network.put(`/persons/${personId}/documents`, upsertDocumentDto);
  }

  async getAllSocialMedia(
    personId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<SocialMedia>> {
    const response = await network.get<PaginatedResponse<SocialMedia>>(
      `/person/${personId}/social-network?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  async geSocialMediaTypes(): Promise<SocialMediaType[]> {
    const response = await network.get<SocialMediaType[]>(`/catalogs/social-network-types`);

    return response.data;
  }

  async getSocialMedia(personId: string, socialMediaId: string): Promise<SocialMedia> {
    const response = await network.get<SocialMedia>(
      `/person/${personId}/social-network/${socialMediaId}`,
    );

    return response.data;
  }

  async createSocialMedia(
    personId: string,
    socialMedia: CreateSocialMediaDto,
  ): Promise<SocialMedia> {
    const response = await network.post<SocialMedia>(
      `/person/${personId}/social-network`,
      socialMedia,
    );

    return response.data;
  }

  async updateSocialMedia(
    personId: string,
    socialMediaId: string,
    socialMedia: UpdateSocialMediaDto,
  ): Promise<SocialMedia> {
    const response = await network.put<SocialMedia>(
      `/person/${personId}/social-network/${socialMediaId}`,
      socialMedia,
    );

    return response.data;
  }

  async deleteSocialMedia(personId: string, socialMediaId: string): Promise<void> {
    await network.delete(`/person/${personId}/social-network/${socialMediaId}`);
  }
}
