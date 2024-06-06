import { Injectable } from '@angular/core';
import network from '../config/network.service';
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import { CreateCompanyDto, UpdateCompanyDto } from './interfaces/company.dto';
import { Company } from '../interfaces/company.interface';
import { Recruiter } from '../interfaces/person.interface';

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

  async getCompanies(params: PaginationParams): Promise<PaginatedResponse<Company>> {
    const response = await network.get<PaginatedResponse<Company>>(`/companies`, { params });

    return response.data;
  }

  async updateCompany(companyId: string, company: UpdateCompanyDto): Promise<Company> {
    const response = await network.put<Company>(`/companies/${companyId}`, company);

    return response.data;
  }

  async deleteCompany(companyId: string): Promise<void> {
    await network.delete(`/companies/${companyId}`);
  }

  async findCompanyRecruiters(
    companyId: string,
    { perPage = 10, page = 1 }: PaginationParams,
  ): Promise<PaginatedResponse<Recruiter>> {
    const response = await network.get<PaginatedResponse<Recruiter>>(
      `/companies/${companyId}/recruiters?page=${page}&perPage=${perPage}`,
    );

    return response.data;
  }

  assignRecruiter(companyId: string, email: string) {
    return network.post(`/companies/${companyId}/recruiters`, { email });
  }
}
