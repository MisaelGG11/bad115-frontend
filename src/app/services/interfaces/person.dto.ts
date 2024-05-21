import { DocumentType, Person } from '../../interfaces/person.interface';

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

export interface UpsertDocumentDto {
  id?: string;
  number: string;
  type: DocumentType;
}
