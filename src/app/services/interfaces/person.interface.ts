import { Person } from '../../interfaces/person';

export interface UpdatePersonDto extends Partial<Person> {
  id: string;
}

export interface CreateAddressDto {
  street: string;
  numberHouse: string;
  countryId: string;
  countryName: string;
  departmentId?: string;
  municipalityId?: string;
}
