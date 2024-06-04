import { Injectable } from '@angular/core';
import network from '../config/network.service';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import { CreateCompanyDto } from './interfaces/company.dto';
import { Company } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor() {}

  async createCompany(company: CreateCompanyDto) {
    return await network.post<Company>(`/companies`, company);
  }

  async getCompany(companyId: string): Promise<Company> {
    const response = await network.get<Company>(`/companies/${companyId}`);

    return response.data;
  }
}
