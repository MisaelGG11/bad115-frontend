import { extend } from '@hapi/joi';

export interface CreateCompanyDto {
  name: string;
  size: string;
  countryId: string;
  email: string;
  password: string;
  description: string;
  website: string;
  phone: string;
  type: string;
}

export interface UpdateCompanyDto extends CreateCompanyDto {}
