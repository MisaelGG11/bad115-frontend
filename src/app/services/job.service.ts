import { Injectable } from '@angular/core';
import network from '../config/network.service';
import axios from 'axios';
import { axiosConfiguration } from '../config/network.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private axiosInstance = axios.create(axiosConfiguration);

  constructor() {}

  async getCategories() {
    return this.axiosInstance.get('/catalogs/technical-skills-candidate');
  }

  async getTechnicalSkillsByCategory(categoryId: string) {
    return this.axiosInstance.get(
      `/catalogs/technical-skills-candidate/technical-skills/category/${categoryId}?categoryId=${categoryId}`,
    );
  }

  async getLanguages() {
    return this.axiosInstance.get('/catalogs/language-type');
  }

  async createJobPosition(jobPosition: any): Promise<any> {
    const response = await network.post<any>(`/job-positions`, jobPosition);

    return response.data;
  }
}
