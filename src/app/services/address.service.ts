import { Injectable } from '@angular/core';
import axios from 'axios';
import { axiosConfiguration } from '../config/network.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private axiosInstance = axios.create(axiosConfiguration);

  constructor() {}

  async getCountries() {
    return this.axiosInstance.get('/addresses/countries');
  }

  async getDepartments() {
    return this.axiosInstance.get('/addresses/departments');
  }

  async getMunicipalities() {
    return this.axiosInstance.get('/addresses/municipalities');
  }

  async getMunicipalitiesByDepartment(departmentId: string) {
    return this.axiosInstance.get(`/addresses/departments/${departmentId}/municipalities`);
  }
}
